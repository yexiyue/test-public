import { useState } from "react";

export type MenuItem = {
  url: string;
  title: string;
  children?: MenuItem[];
};

type MenuProps = {
  menu: MenuItem[];
  selectedKey: string;
  root?: boolean;
};

export const Menu = ({ menu, selectedKey, root = true }: MenuProps) => {
  const [expanded, setExpanded] = useState<string[]>(
    menu.map((item) => item.url)
  );

  return (
    <ul className={root ? "menu w-64" : ""}>
      {menu.map((item) => {
        if (item.children) {
          return (
            <li key={item.url}>
              <details
                open={expanded.includes(item.url)}
                onToggle={() => {
                  setExpanded(
                    expanded.includes(item.url)
                      ? expanded.filter((key) => key !== item.url)
                      : [...expanded, item.url]
                  );
                }}
              >
                <summary>{item.title}</summary>
                <Menu
                  menu={item.children}
                  selectedKey={selectedKey}
                  root={false}
                />
              </details>
            </li>
          );
        }

        return (
          <li key={item.url}>
            <a
              href={item.url}
              className={selectedKey === item.url ? "menu-active" : ""}
            >
              {item.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
};
