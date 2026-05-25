import { Link } from 'react-router-dom';
import { ShoppingBag, Utensils } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = ShoppingBag, 
  title = 'Nothing here yet', 
  description = 'Start exploring to find something you love.',
  actionLabel = 'Browse Menu',
  actionTo = '/menu'
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-brown-900 mb-2">{title}</h3>
      <p className="text-brown-500 mb-6 max-w-sm">{description}</p>
      <Link to={actionTo} className="btn-primary inline-flex items-center gap-2">
        <Utensils className="w-5 h-5" />
        {actionLabel}
      </Link>
    </div>
  );
}
