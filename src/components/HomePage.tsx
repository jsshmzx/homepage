'use client';

import { useState, useEffect } from 'react';

interface Project {
  title: string;
  description: string;
  link?: string;
  tags: string[];
}

const projects: Project[] = [
  {
    title: '项目一',
    description: '这是一个示例项目的描述，展示了主要功能和技术栈。',
    link: '#',
    tags: ['React', 'TypeScript', 'Next.js'],
  },
  {
    title: '项目二',
    description: '另一个有趣的项目，使用现代化的技术栈构建。',
    link: '#',
    tags: ['Node.js', 'Database', 'API'],
  },
  {
    title: '项目三',
    description: '开源贡献或个人作品，展示创造力和技术能力。',
    link: '#',
    tags: ['Design', 'Frontend', 'UI/UX'],
  },
];

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com', icon: '💻' },
  { name: 'Email', url: 'mailto:example@email.com', icon: '📧' },
  { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              主页
            </button>
            <div className="flex gap-6">
              {['about', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                    activeSection === section
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : ''
                  }`}
                >
                  {section === 'about' && '关于'}
                  {section === 'projects' && '项目'}
                  {section === 'contact' && '联系'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center px-6 pt-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              你好 👋
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-8">
              欢迎来到我的个人主页
            </p>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-500 max-w-2xl mx-auto">
              我是一名开发者，热爱创造有趣的项目和探索新技术
            </p>
            <div className="mt-12 flex gap-4 justify-center">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                查看作品
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full font-medium transition-all transform hover:scale-105"
              >
                联系我
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center px-6 py-20"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            关于我
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                我是一名充满热情的开发者，专注于创建优雅且实用的 Web 应用。
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                我喜欢学习新技术，解决复杂的问题，并通过代码将创意变为现实。
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                在工作之余，我热衷于开源贡献和技术分享。
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <h3 className="font-semibold text-xl mb-3">技能</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'JavaScript',
                    'TypeScript',
                    'React',
                    'Next.js',
                    'Node.js',
                    'Tailwind CSS',
                    'Git',
                    'UI/UX',
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="min-h-screen flex items-center justify-center px-6 py-20 bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            项目作品
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-200 dark:border-gray-800"
              >
                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    查看详情 →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen flex items-center justify-center px-6 py-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">联系方式</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            欢迎与我交流，一起探讨技术和创意
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-600 dark:hover:border-blue-400 transition-all transform hover:scale-105 shadow-md"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="font-medium">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center text-gray-500 dark:text-gray-500">
          <p>© {new Date().getFullYear()} 个人主页. Built with Next.js & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
