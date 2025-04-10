// components/listings/ConfirmationStep.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit, Calendar, Image, MapPin, Tag, DollarSign, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ListingFormData } from '@/types/listings';
import { format, parseISO } from 'date-fns';
import { CATEGORY_DISPLAY } from '@/constants/productTypes';

interface Props {
  formData: ListingFormData;
  onEdit: () => void;
  isEditing?: boolean;
  productId?: string;
}

const ConfirmationStep = ({ formData, onEdit, isEditing = false, productId }: Props) => {
  const navigate = useNavigate();
  
  const handleEditAgain = () => {
    console.log("Edit Again clicked - using onEdit callback");
    console.log("Current productId:", productId);
    onEdit();
  };

  // Group unavailable dates into ranges
  const getUnavailableDateRanges = () => {
    if (!formData.unavailableDates || formData.unavailableDates.length === 0) {
      return [];
    }

    // Filter out null dates and convert to Date objects
    const validDates = formData.unavailableDates
      .filter(date => date.date !== null)
      .map(date => ({
        date: parseISO(date.date!),
        isRange: date.isRange,
        rangeStart: date.rangeStart ? parseISO(date.rangeStart) : null,
        rangeEnd: date.rangeEnd ? parseISO(date.rangeEnd) : null
      }));

    // Sort dates
    const sortedDates = [...validDates].sort((a, b) => a.date.getTime() - b.date.getTime());

    const ranges = [];
    let rangeStart = sortedDates[0].date;
    let rangeEnd = sortedDates[0].date;

    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i].date;
      const prevDate = sortedDates[i - 1].date;

      // Check if dates are consecutive
      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        // Consecutive date, extend the range
        rangeEnd = currentDate;
      } else {
        // Non-consecutive date, add the current range and start a new one
        ranges.push({ start: rangeStart, end: rangeEnd });
        rangeStart = currentDate;
        rangeEnd = currentDate;
      }
    }

    // Add the last range
    ranges.push({ start: rangeStart, end: rangeEnd });

    return ranges;
  };

  const unavailableRanges = getUnavailableDateRanges();

  return (
    <div className="space-y-10">
      <div className="space-y-10">
        <div className="text-center">
          <div className="text-green-600">
            <CheckCircle size={48} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            {isEditing ? 'Listing Updated Successfully!' : 'Listing Created Successfully!'}
          </h2>
          <p className="text-gray-600">
            {isEditing
              ? 'Your product listing has been updated.'
              : 'Your product is now available for rent.'}
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
            <div className="font-semibold text-green-700">Title</div>
            <div className="text-gray-600 truncate">{formData.title}</div>

            <div className="font-semibold text-green-700">Category</div>
            <div className="text-gray-600 truncate">{CATEGORY_DISPLAY[formData.category]}</div>

            <div className="font-semibold text-green-700">Location</div>
            <div className="text-gray-600 truncate">{formData.location}</div>

            <div className="font-semibold text-green-700">Images</div>
            <div className="text-gray-600">{formData.images.length} uploaded</div>

            <div className="font-semibold text-green-700">Pricing</div>
            <div className="space-y-2">
              {formData.pricingTiers.map((tier, index) => (
                <div key={index} className="text-gray-600 whitespace-nowrap">
                  {tier.price} Taka 
                  {tier.durationUnit === 'day' ? ' daily' :
                    tier.durationUnit === 'week' ? ' weekly' :
                      tier.durationUnit === 'month' ? ' monthly' :
                        (tier.durationUnit as string).charAt(0).toUpperCase() + (tier.durationUnit as string).slice(1) + 'ly'}
                  {tier.maxPeriod && ` (Max: ${tier.maxPeriod} ${tier.durationUnit}${tier.maxPeriod > 1 ? 's' : ''})`}
                </div>
              ))}
            </div>

            {formData.securityDeposit > 0 && (
              <>
                <div className="font-semibold text-green-700">Security Deposit</div>
                <div className="text-gray-600 whitespace-nowrap">{formData.securityDeposit} Taka</div>
              </>
            )}

            {unavailableRanges.length > 0 && (
              <>
                <div className="font-semibold text-green-700">Unavailable Dates</div>
                <div className="overflow-x-auto">
                  <div className="flex flex-wrap gap-2">
                    {unavailableRanges.map((range, index) => (
                      <div key={index} className="text-sm bg-red-50 text-red-800 px-3 py-1 rounded-md whitespace-nowrap">
                        {format(range.start, "MMM d")} - {format(range.end, "MMM d, yyyy")}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-left max-w-xl mx-auto space-y-4">
        <h4 className="font-semibold text-gray-600">What happens next?</h4>
        <ul className="list-disc list-inside space-y-1 text-green-700">
          <li>Your listing is now live and available for rent</li>
          <li>You'll receive notifications when someone requests to rent</li>
          <li>You can edit your listing anytime from your dashboard</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <Button
          variant="outline"
          onClick={handleEditAgain}
          className="w-full text-gray-600 font-bold border-gray-300 hover:border-green-500 hover:text-green-600"
        >
          Edit Again
        </Button>
        <Button
          onClick={() => navigate('/profile')}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          View My Listings
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;