import { CheckCircle, TrendingUp } from 'lucide-react';
import Card from './Card';
import type { SummaryResult } from '@/types/ai';

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

        {/* AI-Powered Insights */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="text-lg"></div>
            <h4 className="font-medium text-foreground">AI-Powered Analysis</h4>
          </div>
          
          {/* Key Highlights */}
          {result.highlights && result.highlights.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">Key Findings:</h5>
              <div className="space-y-2">
                {result.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">Actionable Recommendations:</h5>
              <div className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback to bullets if no AI data */}
          {(!result.highlights || result.highlights.length === 0) && result.bullets && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">Insights:</h5>
              <div className="space-y-2">
                {result.bullets.map((bullet, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
