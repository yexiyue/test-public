import { useEffect, useRef, useState } from "react";
import type { Article } from "@/pages/search-index.json";
import {
  Charset,
  Document,
  type MergedDocumentSearchResults,
} from "flexsearch";
import lodash from "lodash";
import { createPortal } from "react-dom";
import flexSearchSvg from "@/assets/flexsearch.svg";

export const DocsSearch = () => {
  const [value, setValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fuse = useRef<Document<Article> | null>(null);
  const [results, setResults] = useState<
    Record<
      "docs" | "example" | "principle",
      MergedDocumentSearchResults<Article>
    >
  >({
    docs: [],
    example: [],
    principle: [],
  });

  const containsSearchTerm = (text: string, searchValue: string): boolean => {
    if (!searchValue) return false;
    try {
      const regex = new RegExp(searchValue, "i");
      return regex.test(text);
    } catch {
      return text.toLowerCase().includes(searchValue.toLowerCase());
    }
  };

  useEffect(() => {
    fetch("/ratatui-kit-website/search-index.json")
      .then((response) => response.json())
      .then((data) => {
        const flexSearch = new Document<Article>({
          id: "slug",
          tokenize: "forward",
          encoder: Charset.LatinAdvanced,
          resolution: 9,
          index: [{ field: "title" }, { field: "content", resolution: 3 }],
          store: ["title", "group", "content"],
        });
        data.forEach((doc: Article) => {
          flexSearch.add(doc);
        });
        fuse.current = flexSearch;
      });
  }, []);

  useEffect(() => {
    const res = fuse.current?.search(value, {
      enrich: true,
      suggest: true,
      merge: true,
      highlight: {
        template: "$1",
        boundary: 15,
        ellipsis: { template: "" },
      },
    });
    setResults(lodash.groupBy(res, "doc.group") as any);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSearchClick = () => {
    setShowModal(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const closeModal = () => {
    setShowModal(false);
    setValue("");
    setResults({ docs: [], example: [], principle: [] });
  };

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeModal();
  };

  const showResults =
    value.length > 0 &&
    (results.docs?.length > 0 ||
      results.example?.length > 0 ||
      results.principle?.length > 0);

  return (
    <div className="w-full relative">
      <div className="w-full">
        <label className="input input-sm w-full cursor-pointer">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            placeholder="搜索文档"
            onClick={handleSearchClick}
            readOnly
          />
        </label>
      </div>

      {showModal &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4 sm:px-0"
            onClick={closeModal}
          >
            <div className="fixed inset-0 bg-black/50"></div>

            <div
              className="relative z-10 w-[90%] sm:w-full md:max-w-2xl bg-base-100 mt-6 rounded-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-2 sm:py-4 px-2 sm:px-4 border-b border-base-100">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-[1.2em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </g>
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="search"
                    className="grow input input-md border-0 focus:border-0 focus:outline-none focus:ring-0"
                    placeholder="搜索文档..."
                    value={value}
                    onChange={handleChange}
                    autoFocus
                  />
                  <button
                    className="btn btn-sm btn-ghost ml-1 sm:ml-2"
                    onClick={closeModal}
                  >
                    取消
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden px-4">
                <ul className="menu w-full">
                  {results.docs?.length > 0 && (
                    <>
                      <li className="menu-title text-info">文档</li>
                      {results.docs.map((doc) => {
                        const title = doc.doc?.title || "";
                        const content = doc.highlight?.content || "";
                        const isMatch = containsSearchTerm(title, value);
                        return (
                          <li key={doc.id} className="block my-1">
                            <a
                              href={doc.id as string}
                              className={`hover:bg-neutral hover:text-neutral-content ${
                                isMatch ? "bg-red-600 text-white" : ""
                              }`}
                              onClick={onClick}
                            >
                              <div>
                                <div className="truncate font-bold mb-1">
                                  {title}
                                </div>
                                <div className="truncate">{content}</div>
                              </div>
                            </a>
                          </li>
                        );
                      })}
                    </>
                  )}

                  {results.example?.length > 0 && (
                    <>
                      <li className="menu-title text-info">示例</li>
                      {results.example.map((doc) => {
                        const title = doc.doc?.title || "";
                        const content = doc.highlight?.content || "";
                        const isMatch = containsSearchTerm(title, value);
                        return (
                          <li key={doc.id} className="block my-1">
                            <a
                              href={doc.id as string}
                              className={`hover:bg-neutral hover:text-neutral-content ${
                                isMatch ? "bg-red-600 text-white" : ""
                              }`}
                              onClick={onClick}
                            >
                              <div>
                                <div className="truncate font-bold mb-1">
                                  {title}
                                </div>
                                <div className="truncate">{content}</div>
                              </div>
                            </a>
                          </li>
                        );
                      })}
                    </>
                  )}

                  {results.principle?.length > 0 && (
                    <>
                      <li className="menu-title text-info">原理</li>
                      {results.principle.map((doc) => {
                        const title = doc.doc?.title || "";
                        const content = doc.highlight?.content || "";
                        const isMatch = containsSearchTerm(title, value);
                        return (
                          <li key={doc.id} className="block my-1">
                            <a
                              href={doc.id as string}
                              className={`hover:bg-neutral hover:text-neutral-content ${
                                isMatch ? "bg-red-600 text-white" : ""
                              }`}
                              onClick={onClick}
                            >
                              <div>
                                <div className="truncate font-bold mb-1">
                                  {title}
                                </div>
                                <div className="truncate">{content}</div>
                              </div>
                            </a>
                          </li>
                        );
                      })}
                    </>
                  )}

                  {!value && (
                    <li className="py-4 text-center text-gray-500">
                      没有搜索历史
                    </li>
                  )}

                  {value && !showResults && (
                    <li className="py-4 text-center text-gray-500">
                      未匹配到相关搜索结果
                    </li>
                  )}
                </ul>
              </div>

              {/* footer */}
              <div className="p-2 border-t border-base-100 shadow-2xl flex justify-end">
                <img className="h-6" src={flexSearchSvg.src} />
              </div>
            </div>
          </div>,
          document.body,
          "search-modal"
        )}
    </div>
  );
};
