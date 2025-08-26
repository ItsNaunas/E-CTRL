import { CheckCircle, TrendingUp } from 'lucide-react';
import Card from './Card';
import type { SummaryResult } from '@/lib/mock';

interface SummaryCardProps {
  result: SummaryResult;
}

export default function SummaryCard({ result }: SummaryCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    return <TrendingUp className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <Card className="animate-fade-in border-accent/20 bg-accent/5">
      <div className="space-y-4">
        {/* Header with score */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {result.title}
          </h3>
          <div className="flex items-center space-x-2">
            {getScoreIcon(result.score)}
            <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}
            </span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        </div>

        {/* Insights list */}
        <div className="space-y-3">
          {result.bullets.map((bullet, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">
                {bullet}
              </p>
            </div>
          ))}
        </div>

        {/* Note */}
        {result.note && (
          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground italic">
              {result.note}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
