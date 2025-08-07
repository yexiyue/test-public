import { buildHeadingTree, type HeadingData } from "@/utils";
import { useEffect, useMemo, useState } from "react";

export const HeadingMenu = (props: {
  headingData: HeadingData[];
  readingTime: number;
}) => {
  const [hash, setHash] = useState<string>("");
  const headingTree = useMemo(() => {
    return buildHeadingTree(props.headingData);
  }, [props.headingData]);
  const hashChange = () => {
    setHash(decodeURI(location.hash).slice(1));
  };

  useEffect(() => {
    hashChange();

    window.addEventListener("popstate", hashChange);
    return () => {
      window.removeEventListener("popstate", hashChange);
    };
  }, []);

  const renderHeadings = (headings: HeadingData[]) => {
    return headings.map((heading) => (
      <li key={heading.text}>
        <a
          href={`#${heading.slug}`}
          className={hash === heading.slug ? "text-info" : ""}
        >
          <p className="truncate">{heading.text}</p>
        </a>
        {heading.children && heading.children.length > 0 && (
          <ul className="overflow-hidden w-full">
            {renderHeadings(heading.children)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className="w-68 shrink-0 sticky top-0 p-4 pl-0 hidden md:flex">
      <div className="divider divider-horizontal divider-nature ml-0"></div>
      <div>
        <h2>目录</h2>
        {props.readingTime > 0 && (
          <p className="text-sm pt-2 text-gray-500">
            预计阅读时间：{props.readingTime} 分钟
          </p>
        )}
        <ul className="menu">{renderHeadings(headingTree)}</ul>
      </div>
    </div>
  );
};
