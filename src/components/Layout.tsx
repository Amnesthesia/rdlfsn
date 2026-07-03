import type { ComponentChildren } from "preact";
import type { ImgHTMLAttributes, PropsWithChildren } from "preact/compat";

interface SectionProps {
	title: string;
	children?: ComponentChildren;
	borderColor: string;
	id?: string;
}

export const Section = ({ title, children, borderColor, id }: SectionProps) => (
	<section className="rounded-lg p-6" id={id}>
		<h2 className={`text-2xl font-bold mb-4 border-b-2 ${borderColor} pb-2`}>
			{title}
		</h2>
		<div className="markdown-content">{children}</div>
	</section>
);

interface MarkdownContentProps {
	html: string;
}

interface LayoutProps {
	children?: ComponentChildren;
}

export function MarkdownContent({ html }: MarkdownContentProps) {
	return (
		// biome-ignore lint/security/noDangerouslySetInnerHtml: Used to render markdown
		<div dangerouslySetInnerHTML={{ __html: html }} />
	);
}

export function MainLayout({ children }: LayoutProps) {
	return (
		<div className="container mx-auto px-0 max-w-4xl gap-2 bg-white">
			{children}
		</div>
	);
}

export function TwoColumnLayout({ children }: LayoutProps) {
	return (
		<div className="grid grid-cols-1 print:grid-cols-3 md:grid-cols-3 gap-2">
			{children}
		</div>
	);
}

export function LeftColumn({ children }: LayoutProps) {
	return (
		<div className="bg-gray-900 text-white shadow-lg flex flex-row md:flex-col print:flex-col">
			{children}
		</div>
	);
}

export function RightColumn({ children }: LayoutProps) {
	return <div className="md:col-span-2 print:col-span-2">{children}</div>;
}

export function Avatar() {
	return (
		<div className="flex justify-center m-6">
			<img
				src="https://avatars.githubusercontent.com/u/3265008?v=4"
				alt="Avatar"
				className="w-48 h-48 rounded-full border-4 border-gray-300 shadow-lg"
			/>
		</div>
	);
}

const LANGUAGES = {
	Ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-plain.svg",
	TypeScript:
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
	Python:
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
	"C/++":
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
};

const TECHNOLOGIES = {
	AWS: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
	DigitalOcean:
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/digitalocean/digitalocean-original.svg",

	GithubActions:
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg",
	Docker:
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
	Redis:
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
	ElasticSearch:
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg",
	// Kubernetes:
	//	"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg",
};

const FRAMEWORKS = {
	Apollo:
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apollographql/apollographql-original.svg",
	GraphQL:
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg",
	PostgreSQL:
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
	Expo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/expo/expo-original.svg",
	"React/Native":
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/reactnative/reactnative-original.svg",
};

function SkillListItem({
	children,
	icon,
	...rest
}: PropsWithChildren<{ icon: string } & ImgHTMLAttributes>) {
	return (
		<li className="flex space-y-2 items-center justify-start gap-4">
			<img
				src={icon}
				{...rest}
				className={["w-6 h-6 mt-1", rest.className]
					.flat()
					.filter(Boolean)
					.join(" ")}
				alt={rest.alt}
			/>
			<span className="text-white">{children}</span>
		</li>
	);
}
export function Skills() {
	return (
		<>
			<ul className="list-none">
				<SkillListItem icon={LANGUAGES.Ruby}>Ruby</SkillListItem>
				<SkillListItem icon={LANGUAGES.TypeScript}>TypeScript</SkillListItem>
				<SkillListItem icon={LANGUAGES.Python}>Python</SkillListItem>
				<SkillListItem icon={LANGUAGES["C/++"]}>C/++</SkillListItem>
			</ul>
			<p className="my-4 border-b">
				<b>Infra</b>
			</p>
			<ul className="list-none">
				<SkillListItem icon={TECHNOLOGIES.AWS}>AWS</SkillListItem>
				<SkillListItem icon={TECHNOLOGIES.DigitalOcean}>
					DigitalOcean
				</SkillListItem>
				<SkillListItem icon={TECHNOLOGIES.GithubActions}>
					Github Actions
				</SkillListItem>
				<SkillListItem icon={TECHNOLOGIES.Docker}>Docker</SkillListItem>
				<SkillListItem icon={TECHNOLOGIES.Redis}>Redis</SkillListItem>
				<SkillListItem icon={TECHNOLOGIES.ElasticSearch}>
					ElasticSearch
				</SkillListItem>
			</ul>
			<p className="my-4 border-b">
				<b>Frameworks</b>
			</p>
			<ul className="list-none">
				<SkillListItem icon={FRAMEWORKS.Apollo} className="invert">
					Apollo
				</SkillListItem>
				<SkillListItem icon={FRAMEWORKS.GraphQL}>GraphQL</SkillListItem>
				<SkillListItem icon={FRAMEWORKS.PostgreSQL}>PostgreSQL</SkillListItem>
				<SkillListItem icon={FRAMEWORKS.Expo} className="invert">
					Expo
				</SkillListItem>
				<SkillListItem icon={FRAMEWORKS["React/Native"]}>
					React/Native
				</SkillListItem>
			</ul>
		</>
	);
}
