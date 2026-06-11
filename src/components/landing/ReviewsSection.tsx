'use client';

import type { Review } from '@/types';
import StarRating from '@/components/ui/StarRating';

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section id="reviews" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Ulasan Pelanggan
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Cerita dari para pelanggan yang sudah menikmati hidangan dan suasana kami
          </p>
        </div>

        {reviews.length > 0 ? (
          <>
            {/* Mobile: horizontal scroll */}
            <div className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 rounded-2xl p-6 min-w-[300px] max-w-[340px] snap-center flex-shrink-0 shadow-sm"
                >
                  <ReviewCardContent review={review} />
                </div>
              ))}
            </div>

            {/* Tablet/Desktop: grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <ReviewCardContent review={review} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <p>Belum ada ulasan</p>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCardContent({ review }: { review: Review }) {
  // Generate avatar background from name hash
  const colors = [
    'bg-primary-500',
    'bg-secondary-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-indigo-500',
  ];
  const colorIdx = review.name.charCodeAt(0) % colors.length;

  return (
    <>
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full ${colors[colorIdx]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
        >
          {review.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {review.name}
          </p>
          <p className="text-xs text-gray-400">{review.date}</p>
        </div>
      </div>

      {/* Stars */}
      <StarRating rating={review.rating} size="sm" className="mb-2" />

      {/* Text */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
        "{review.text}"
      </p>
    </>
  );
}
