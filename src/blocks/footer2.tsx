interface MenuItem {
  title: string
  links: { text: string; url: string }[]
}

interface Footer2Props {
  logo?: { url: string; title: string }
  tagline?: string
  menuItems?: MenuItem[]
  copyright?: string
  bottomLinks?: { text: string; url: string }[]
}

const Footer2 = ({
  logo = { url: '#', title: 'Shadcnblocks.com' },
  tagline = 'Components made easy.',
  menuItems = [
    {
      title: 'Product',
      links: [
        { text: 'Overview', url: '#' },
        { text: 'Pricing', url: '#' },
        { text: 'Features', url: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', url: '#' },
        { text: 'Blog', url: '#' },
        { text: 'Contact', url: '#' },
      ],
    },
    {
      title: 'Social',
      links: [
        { text: 'Twitter', url: '#' },
        { text: 'Instagram', url: '#' },
      ],
    },
  ],
  copyright = '© 2025 Shadcnblocks.com. All rights reserved.',
  bottomLinks = [
    { text: 'Terms and Conditions', url: '#' },
    { text: 'Privacy Policy', url: '#' },
  ],
}: Footer2Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <a href={logo.url} className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">{logo.title}</span>
              </a>
              <p className="mt-4 font-bold">{tagline}</p>
            </div>
            {menuItems.map((section, i) => (
              <div key={i}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="text-muted-foreground space-y-4">
                  {section.links.map((link, j) => (
                    <li key={j} className="hover:text-primary font-medium">
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-muted-foreground mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, i) => (
                <li key={i} className="hover:text-primary underline">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  )
}

export { Footer2 }
