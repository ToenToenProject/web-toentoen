import Link from 'next/link';
import { NewsArticle } from '@/constants/news';

export const NewsCard = ({ article }: { article: NewsArticle }) => {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            <img 
                src={article.image} 
                alt="" 
                aria-hidden="true"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" 
            />
            <span className="absolute left-3 top-3 rounded-full bg-[#00c2a8] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-xs">
                {article.type}
            </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
            </div>
            <h3 className="mb-2 text-base font-bold leading-snug text-gray-900 line-clamp-2">
                {article.title}
            </h3>
            <p className="mb-6 flex-1 text-xs text-gray-500 line-clamp-3 leading-relaxed">
                {article.desc}
            </p>
            <Link 
                href={`/news/${article.id}`} 
                className="w-full rounded-full border-2 border-[#00c2a8] py-2 text-center text-xs font-bold text-[#00c2a8] transition-colors hover:bg-[#00c2a8] hover:text-white"
            >
                Baca Selengkapnya
            </Link>
        </div>
        </div>
    );
};
