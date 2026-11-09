const TAG_COLORS = ["bg-[#F6A9CB]", "bg-[#A9C4F2]", "bg-[#A3B676]"];

const NewsCard = ({ index, webTitle, webUrl, webPublicationDate, sectionName, fields }) => {
  const { thumbnail, trailText, byline } = fields;

  const date = new Date(webPublicationDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // first story is shown as a big featured card
  if (index === 0) {
    return (
      <a
        href={webUrl}
        target="_blank"
        rel="noreferrer"
        className="grid overflow-hidden rounded-[28px] bg-[#F7F4E3] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:col-span-2 lg:col-span-3 lg:grid-cols-2"
      >
        <img src={thumbnail} alt={webTitle} className="h-64 w-full object-cover lg:h-full" />

        <div className="flex flex-col justify-center p-8">
          <span className="w-fit rounded-full bg-[#181818] px-3 py-1 text-xs font-bold text-[#FADF6B]">
            Top story
          </span>

          <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#1C1B2E]/50">
            {date}
          </div>

          <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-[#1C1B2E]">
            {webTitle}
          </h2>

          <p className="mt-3 text-base leading-7 text-[#666477]">{trailText}</p>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm font-medium text-[#1C1B2E]/70">{byline}</span>
            <span className="rounded-full bg-[#181818] px-5 py-2 text-sm font-bold text-[#FADF6B]">
              Read more →
            </span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={webUrl}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col overflow-hidden rounded-[28px] bg-[#F7F4E3] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <img src={thumbnail} alt={webTitle} className="h-44 w-full object-cover" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold text-[#1C1B2E] ${
              TAG_COLORS[index % TAG_COLORS.length]
            }`}
          >
            {sectionName}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1B2E]/50">
            {date}
          </span>
        </div>

        <h2 className="mt-3 line-clamp-3 font-display text-lg font-bold text-[#1C1B2E]">
          {webTitle}
        </h2>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#666477]">{trailText}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="truncate text-xs font-medium text-[#1C1B2E]/70">{byline}</span>
          <span className="shrink-0 rounded-full bg-[#181818] px-4 py-1.5 text-xs font-bold text-[#FADF6B]">
            Read more →
          </span>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;