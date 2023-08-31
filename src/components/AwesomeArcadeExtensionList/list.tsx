import { ExtensionList } from "@/scripts/Utils/ParseExtensionsXML";
import React from "react";
import getElement from "@/scripts/Utils/Element";
import { forceOutboundLinksToNewPage } from "@/scripts/Utils/PageUtils";
import { AwesomeArcadeExtensionGroup } from "@/components/AwesomeArcadeExtensionList/extension";
import { AwesomeArcadeToolGroup } from "@/components/AwesomeArcadeExtensionList/tool";

export function AwesomeArcadeExtensionsList({
  list,
}: {
  list: ExtensionList;
}): JSX.Element {
  React.useEffect(() => {
    const div = getElement("awesomeArcadeExtensions") as HTMLDivElement;
    forceOutboundLinksToNewPage(div);
  }, []);

  return (
    <div id="awesomeArcadeExtensions" style={{ overflowX: "hidden" }}>
      <AwesomeArcadeExtensionGroup exts={list.notBuiltIn} />
    </div>
  );
}

export function AwesomeArcadeToolsList({
  list,
}: {
  list: ExtensionList;
}): JSX.Element {
  React.useEffect(() => {
    const div = getElement("awesomeArcadeTools") as HTMLDivElement;
    forceOutboundLinksToNewPage(div);
  }, []);

  return (
    <div id="awesomeArcadeTools" style={{ overflowX: "hidden" }}>
      <AwesomeArcadeToolGroup tools={list.tools} />
    </div>
  );
}
