import {
	Avatar,
	LeftColumn,
	MainLayout,
	MarkdownContent,
	RightColumn,
	Section,
	Skills,
	TwoColumnLayout,
} from "./Layout.js";

export interface ResumeData {
	title: string;
	header: string;
	experience: string;
	projects: string;
	contact: string;
	skills: string;
	education: string;
}

interface DocumentHeadProps {
	title: string;
}

const DocumentHead = ({ title }: DocumentHeadProps) => (
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>{title} - Resume</title>
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
			crossorigin="anonymous"
			referrerpolicy="no-referrer"
		/>
		<script src="https://cdn.tailwindcss.com"></script>
		<style>{`
      @media print {
        .no-print { display: none !important; }
        body { 
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
      @layer base {
        @page {
          margin: 0;
        }
        @media print {
          details {
            /* Force details to be open when printing */
            display: block;
          }
        }

        summary::marker {
          display: none;
          content: '';
        }
        summary::before {
          content: '❯ ';
          @apply inline-block mr-2 transition-transform;
        }

        details[open] summary::before {
          @apply rotate-90;
        }
      }
    `}</style>
		<style>
			{`
        h2 > strong {
          float: right;
          font-weight: normal;
          font-size: 0.875rem;
        }
        h2:has(+ p > strong) {
          margin-top: 12px;
          margin-bottom: 0px !important;
        }
        h2 + p > strong {
          margin-top: 0;
          margin-bottom: 0;
        }
        h3 > strong {
          float: right;
          font-weight: normal;
          font-size: 0.875rem;
        }
        h3:has(+ p > em), h3:has(+ details), h2:has(+ details) {
          margin-bottom: 0px !important;
        }
        h2 + details, h3 + details {
          margin-bottom: 16px;
        }
        h3 + p > em {
          margin-top: 0;
          margin-bottom: 0;
          font-size: 0.875rem;
        }
        details > summary > h2,
        details > summary > h3 {
          display: inline;
        }

        summary > h3 + p > i {
          margin-left: 0.825rem;
        }
        summary > h3 + p > strong {
          margin-left: 0.825rem;
        }
        summary > h2 + p > strong {
          margin-left: 0.825rem;
        }
        details > p {
          margin-left: 0.825rem;
        }
      `}
		</style>
		<script src="js/markdown.js"></script>
	</head>
);

interface HeaderSectionProps {
	content: string;
}

const HeaderSection = ({ content }: HeaderSectionProps) => (
	<header className="p-6 mt-8 markdown-content flex flex-col items-center justify-center">
		<p>
			<h1 className="mt-4 mb-0 pb-0" style={{ marginBottom: 0 }}>
				Victor Rudolfsson
			</h1>
			<strong>Full Stack - Software Engineer</strong>
		</p>
		<p className="mt-6">
			<i>Passionate about creating elegant solutions to complex problems</i>
		</p>
	</header>
);

interface ResumeTemplateProps {
	data: ResumeData;
}

export function ResumeTemplate({ data }: ResumeTemplateProps) {
	return (
		<html lang="en">
			<DocumentHead title={data.title} />
			<body className="bg-gray-100 min-h-screen">
				<MainLayout>
					<TwoColumnLayout>
						<LeftColumn>
							<Avatar />
							<Section
								title="Contact"
								borderColor="border-purple-500"
								id="contact"
							>
								<MarkdownContent html={data.contact} />
							</Section>

							<Section title="Skills" borderColor="border-red-500" id="skills">
								<Skills />
							</Section>
						</LeftColumn>

						<RightColumn>
							<HeaderSection content={data.header} />
							<Section
								title="Experience"
								borderColor="border-blue-500"
								id="experience"
							>
								<MarkdownContent html={data.experience} />
							</Section>

							<Section
								title="Projects"
								borderColor="border-green-500"
								id="projects"
							>
								<MarkdownContent html={data.projects} />
							</Section>

							<Section
								title="Education"
								borderColor="border-yellow-500"
								id="education"
							>
								<MarkdownContent html={data.education} />
							</Section>
						</RightColumn>
					</TwoColumnLayout>
				</MainLayout>
			</body>
		</html>
	);
}
