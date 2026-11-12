import { LinkButton } from "@/components/top/link-button";
import { siteConfig } from "@/config/site.config";

export function BillDisclaimer() {
  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* データの出典について */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-black">掲載コンテンツについて</h3>
        <p className="text-xs leading-relaxed text-mirai-text-note">
          掲載されている議案情報は、{siteConfig.councilName}
          の公式サイトで公開されている議案などの情報を基に、運営者が整理したものです。「要約」は運営者が資料の記載に基づいて書いたもので、「原文」は公式資料の文言をそのまま掲載しています。資料に書かれていない内容や、確認できていない賛否は掲載していません。
        </p>
      </div>

      {/* 掲載コンテンツについての免責事項 */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-black">免責事項</h3>
        <p className="text-xs leading-relaxed text-mirai-text-note">
          本サイトで公開する情報は、可能な限り正確かつ最新の情報を反映するよう努めていますが、その正確性・完全性・即時性について保証するものではありません。正確な情報は、公式文書や一次資料をご確認ください。
        </p>
      </div>

      <LinkButton
        href="/faq"
        icon={{
          src: "/icons/question-bubble.svg",
          alt: "note",
          width: 22,
          height: 22,
        }}
      >
        よくある質問
      </LinkButton>
    </div>
  );
}
