import { Extension, ExtensionRef, URLLink } from "../../scripts/ParseListXML";
import React from "react";
import "tippy.js/dist/tippy.css";
import { copyTextToClipboard } from "@/scripts/Utils/Clipboard";
import Link from "next/link";
import { smoothScrollHash } from "@/components/Linkable/Header";
import { AnalyticEvents } from "@/components/Analytics";
import { useRouter } from "next/router";
import { TippyJSLibContext } from "@/pages/_app";
import { Instance } from "tippy.js";

export function AwesomeArcadeExtension({
  ext,
  highlight,
  showImportURL,
  pad,
}: {
  ext: Extension;
  highlight?: boolean | undefined;
  showImportURL?: boolean | undefined;
  pad?: boolean | undefined;
}): JSX.Element {
  const tippyJSLib = React.useContext(TippyJSLibContext);
  const [showCardLink, setShowCardLink] = React.useState(false);
  const [tooltip, setTooltip] = React.useState("Click to copy");
  const tippyRef = React.useRef<Instance | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (tippyJSLib !== null && buttonRef.current !== null) {
      if (tippyRef.current !== null) {
        tippyRef.current.setContent(tooltip);
      } else {
        tippyRef.current = tippyJSLib.default(buttonRef.current, {
          content: tooltip,
        });
      }
    }
  }, [tippyJSLib, tooltip]);

  return (
    <div
      className={`card ${pad ? "mb-2" : ""} ${
        highlight ? "border-primary border-3" : ""
      } h-100`}
      id={ext.repo}
    >
      <div className="card-body">
        <h5
          className="card-title"
          onMouseEnter={() => {
            setShowCardLink(true);
          }}
          onMouseLeave={() => {
            setShowCardLink(false);
          }}
        >
          {ext.title}
          {ext.javascriptOnly ? (
            <>
              {" "}
              <span className="badge text-bg-warning me-1">
                JavaScript only
              </span>
            </>
          ) : undefined}
          {showCardLink ? (
            <Link
              className="ms-1"
              href={`/extensions#${ext.repo}`}
              onClick={smoothScrollHash}
            >
              <i className="bi-link-45deg" />
            </Link>
          ) : undefined}
        </h5>
        <h6 className="card-subtitle mb-2 text-body-secondary">
          Made by{" "}
          <a
            href={`https://github.com/${ext.author}`}
            target="_blank"
            rel="noopener noreferer"
          >
            {ext.author}
          </a>
        </h6>
        {showImportURL == undefined || showImportURL ? (
          <>
            Import this{" "}
            {ext.javascriptOnly ? (
              <>
                <b>JavaScript only</b>{" "}
              </>
            ) : null}
            extension with the URL:
            <blockquote className="border-start border-secondary border-2 mt-1 mb-2">
              {/* This transform is applied so the stretched-link only applies up to this div */}
              <div style={{ transform: "rotate(0)" }}>
                <button
                  type="button"
                  className="btn text-start"
                  style={{ wordBreak: "break-all" }}
                  ref={buttonRef}
                  onMouseEnter={() => {
                    setTooltip("Click to copy");
                  }}
                  onClick={() => {
                    if (copyTextToClipboard(ext.url)) {
                      setTooltip("Copied!");
                    } else {
                      setTooltip(
                        "Failed to copy - did you give us clipboard permission?",
                      );
                    }
                    tippyRef.current?.show();
                    window.document.documentElement.dispatchEvent(
                      new CustomEvent<string>("clickrepo", {
                        detail: ext.repo,
                      }),
                    );
                    AnalyticEvents.sendAwesomeClick(ext.repo);
                  }}
                >
                  <a className="stretched-link">{ext.url}</a>
                </button>
              </div>
            </blockquote>
          </>
        ) : (
          <></>
        )}
        <div
          className="card-text"
          dangerouslySetInnerHTML={{ __html: ext.description }}
        />
        <ul className="list-inline mb-0">
          {ext.links.map((link: URLLink) => {
            return (
              <li key={link.url} className="list-inline-item">
                <a
                  href={link.url}
                  className="card-link ms-0 me-3"
                  // style={{ whiteSpace: "nowrap" }}
                  target="_blank"
                  rel="noopener noreferer"
                >
                  {link.label != undefined ? link.label : link.url}
                </a>
              </li>
            );
          })}
        </ul>
        {ext.forks != undefined && ext.forks.length > 0 ? (
          <div className="mt-3">
            <div className="alert alert-primary mb-0" role="alert">
              There {ext.forks.length === 1 ? "is" : "are"}{" "}
              <b>{ext.forks.length}</b> fork
              {ext.forks.length !== 1 ? "s" : ""} available:
              <ul>
                {ext.forks.map((e: ExtensionRef) => {
                  return (
                    <li key={e.repo}>
                      <Link
                        href={`/extensions#${e.repo}`}
                        onClick={smoothScrollHash}
                      >
                        {e.repo}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : undefined}
        {ext.depreciatedBy != undefined && ext.depreciatedBy.length > 0 ? (
          <div className="mt-3">
            <div className="alert alert-warning mb-0" role="alert">
              This extension is deprecated by <b>{ext.depreciatedBy.length}</b>{" "}
              other extension
              {ext.depreciatedBy.length !== 1 ? "s" : ""}:
              <ul>
                {ext.depreciatedBy.map((e: ExtensionRef) => {
                  return (
                    <li key={e.repo}>
                      <Link
                        href={`/extensions#${e.repo}`}
                        onClick={smoothScrollHash}
                      >
                        {e.repo}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : undefined}
      </div>
    </div>
  );
}

export function AwesomeArcadeExtensionGroup({
  title,
  description,
  exts,
  showImportURL,
  pad,
}: {
  title?: JSX.Element | undefined;
  description?: JSX.Element | undefined;
  exts: Extension[];
  showImportURL?: boolean | undefined;
  pad?: boolean | undefined;
}): JSX.Element {
  const router = useRouter();

  const [extToHighlight, setExtToHighlight] = React.useState<
    string | undefined
  >(undefined);

  const onHashChange = (e?: HashChangeEvent | undefined) => {
    const repo = e
      ? e.newURL.split("#")[1]
      : window.location.hash.replaceAll("#", "");
    console.log(`Changing extension to highlight ${repo}`);
    setExtToHighlight(repo);
  };

  React.useEffect(() => {
    setTimeout(() => {
      onHashChange();
    });

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  React.useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      onHashChange();
    });

    return () =>
      router.events.off("routeChangeComplete", () => {
        onHashChange();
      });
  }, [router.events]);

  return (
    <div className={pad == undefined || pad ? "mb-3" : ""}>
      {title}
      {description}
      {exts.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
          {exts.map((ext, i) => {
            return (
              <div className="col py-3" key={ext.repo}>
                <AwesomeArcadeExtension
                  ext={ext}
                  highlight={ext.repo === extToHighlight}
                  showImportURL={showImportURL}
                  pad={i < exts.length - 1}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="alert alert-warning" role="alert">
          Could not find any results with your search query!
        </div>
      )}
    </div>
  );
}
