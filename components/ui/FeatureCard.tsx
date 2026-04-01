'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './Card';

interface FeatureCardProps {
  icon: LucideIcon;
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  features: string[];
  featureColor: string;
}

export const FeatureCard = ({
  icon: Icon,
  category,
  categoryColor,
  title,
  description,
  features,
  featureColor,
}: FeatureCardProps) => {
  return (
    <Card className="border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.08)] rounded-2xl hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] transition-shadow duration-300">
      <CardContent className="p-0">
        {/* Icon and Category */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-full ${categoryColor}`}>
            <Icon className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${featureColor}`}>
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold [font-family:var(--font-heading)] text-slate-900 mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-7 text-slate-600 mb-5">
          {description}
        </p>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <span
              key={index}
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${featureColor} bg-opacity-10 border border-current border-opacity-20`}
            >
              {feature}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
