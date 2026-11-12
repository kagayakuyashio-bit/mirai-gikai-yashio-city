-- 八潮市 議案取り込みテンプレート（<...> を実際の値に置き換えて使う。実データはコミットしない）
begin;
delete from bills where bill_number in ('<議案第N号>');
-- 新しい会期を作る場合のみ（既存会期に追加するときは次の2行を省く）
delete from council_sessions where slug='<r8-3>';
insert into council_sessions (name, start_date, end_date, slug, council_url, is_active)
values ('<令和8年第3回定例会>','<YYYY-MM-DD>','<YYYY-MM-DD>','<r8-3>','<議案ページURL>', false);

insert into bills (name, bill_number, status, status_note, publish_status, published_at,
  council_session_id, committee_id, source_url, submitted_date, decided_date, bill_type)
select '<件名>','<議案第N号>','<approved|rejected|submitted|in_committee>','<議決結果：原案可決（…）>','published',
  now(), s.id, (select id from committees where name='<委員会名。付託省略は null に>'),
  '<議案PDFのURL>','<上程日>','<議決日 or null>','bill'
from council_sessions s where s.slug='<r8-3>';

insert into bill_contents (bill_id, difficulty_level, title, summary, content)
select b.id, d.lv::difficulty_level_enum, '<件名>', '<要約（カード用の1〜2文）>',
$md$## 基本情報
...
## 要約（資料の記載に基づく運営者の要約）
...
## 議案の原文（八潮市公式サイトの議案PDFより）
> ...
## 出典（八潮市公式サイト）
- [議案PDF](<URL>)
$md$
from bills b, (values ('normal'),('hard')) as d(lv) where b.bill_number='<議案第N号>';
commit;
