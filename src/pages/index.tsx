import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

const sections = [
  {
    title: 'Development Environment',
    description: 'WSL setup, terminal configuration, and VSCode tips for your daily workflow.',
    to: 'docs/development-environment/wsl',
  },
  {
    title: 'Version Control',
    description: 'Git workflows, branch management, pull requests, and team collaboration tips.',
    to: 'docs/version-control/git',
  },
  {
    title: 'Cloud & DevOps',
    description: 'AWS CLI operations, EKS, RDS, CodeCommit, and Docker container management.',
    to: 'docs/cloud-devops/aws-cli',
  },
  {
    title: 'Other Tools',
    description: 'Mlflow3, PyManager, and other miscellaneous tools and setup guides.',
    to: 'docs/other-tools/others',
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <header className="hero hero--primary">
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </header>
      <main className="container" style={{ padding: '3rem 0' }}>
        <div className="row">
          {sections.map((section) => (
            <div key={section.title} className="col col--6 margin-bottom--lg">
              <Link
                to={useBaseUrl(section.to)}
                className="card homepage-card padding--lg"
                style={{ textDecoration: 'none', height: '100%' }}>
                <div className="card__header">
                  <h3>{section.title}</h3>
                </div>
                <div className="card__body">
                  <p>{section.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
