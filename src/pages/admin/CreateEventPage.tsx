import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { eventsApi } from '../../api';

import {
  Button,
  Input,
  Textarea,
} from '../../components/ui';

interface FormData {
  title: string;
  description: string;
  event_date: string;
  capacity: number;
}

const schema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),

  event_date: z
    .string()
    .min(1, 'Event date is required'),

  capacity: z
    .number()
    .min(1, 'Capacity must be at least 1'),
});

export default function CreateEventPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      capacity: 100,
    },
  });

  /* ================================================= */
  /* SUBMIT */
  /* ================================================= */

  const onSubmit = async (
    data: FormData
  ) => {
    setLoading(true);

    try {
      await eventsApi.create(data);

      toast.success(
        'Event created successfully!'
      );

      navigate('/admin/events');

    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          'Failed to create event'
      );

    } finally {
      setLoading(false);
    }
  };

  /* ================================================= */
  /* UI */
  /* ================================================= */

  return (
    <div className="max-w-2xl">
      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Event
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Add a new campus event
        </p>
      </div>

      {/* FORM CARD */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* TITLE */}

          <Input
            label="Event Title"
            placeholder="Enter event title"
            error={errors.title?.message}
            {...register('title')}
          />

          {/* DESCRIPTION */}

          <Textarea
            label="Description"
            placeholder="Describe the event..."
            error={
              errors.description?.message
            }
            {...register('description')}
          />

          {/* EVENT DATE */}

          <Input
            label="Event Date"
            type="datetime-local"
            error={
              errors.event_date?.message
            }
            {...register('event_date')}
          />

          {/* CAPACITY */}

          <Input
            label="Capacity"
            type="number"
            placeholder="e.g. 100"
            error={
              errors.capacity?.message
            }
            {...register('capacity', {
              valueAsNumber: true,
            })}
          />

          {/* ACTIONS */}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              loading={loading}
            >
              Create Event
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}