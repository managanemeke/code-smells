# huashu-md-html

Скилл конвертирует документы и веб-страницы в Markdown, а Markdown — в HTML и DOCX.

## Через Codex

Укажите скилл, входной файл и путь для результата. Например:

> Используй `$huashu-md-html`. Преобразуй `docs/guide.md` в `guide.html` с темой `reading`.

## Из терминала

Добавьте окружение установленного скилла в `PATH` для текущей сессии:

```bash
skill_dir="${CODEX_HOME:-$HOME/.codex}/skills/huashu-md-html"
export PATH="$skill_dir/.venv/bin:$PATH"
```

Выберите нужную команду и подставьте пути к файлам:

```bash
# Документ или таблица → Markdown
python3 "$skill_dir/scripts/any_to_md.py" report.docx -o report.md

# Локальный HTML → Markdown
python3 "$skill_dir/scripts/html_to_md.py" article.html -o article.md

# Markdown → HTML
python3 "$skill_dir/scripts/md_to_html.py" guide.md --theme reading -o guide.html

# Markdown → DOCX
python3 "$skill_dir/scripts/md_to_docx.py" guide.md -o guide.docx
```

Для URL статьи используйте `html_to_md.py`, чтобы извлечь основной текст. Для URL технической документации попробуйте `any_to_md.py`, чтобы сохранить структуру страницы.

Темы HTML — `article` для статей, `report` для отчётов, `reading` для чтения и `interactive` для длинных документов с навигацией.

## PDF и EPUB

В установленном комплекте четыре скрипта конвертации. Для PDF откройте сгенерированный HTML в браузере и выберите «Печать → Сохранить как PDF». Для EPUB используйте Pandoc:

```bash
pandoc guide.md -o guide.epub
```
