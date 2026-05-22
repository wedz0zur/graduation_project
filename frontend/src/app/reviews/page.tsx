import { SectionTitle } from "@/src/shared/ui/section-title";
import { reviews } from "@/src/shared/lib/data";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? "#E30613" : "#E5E5E5"}
          stroke={i < rating ? "#E30613" : "#E5E5E5"}
          strokeWidth="1"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="container py-12 flex flex-col items-center">
      <SectionTitle
        title="Отзывы наших клиентов"
        subtitle={`Рейтинг ${averageRating.toFixed(1)} из 5 на основе ${reviews.length} отзывов`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-[#E5E5E5] rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-[#333333]">{review.name}</h3>
                <p className="text-xs text-[#999999]">{review.city}</p>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-sm text-[#666666] leading-relaxed">{review.text}</p>
            <p className="text-xs text-[#999999] mt-4">
              {new Date(review.date).toLocaleDateString("ru-RU")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
