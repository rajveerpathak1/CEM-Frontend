import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { eventsApi } from '../../api';
import { Button, Input, Textarea, Select, Skeleton } from '../../components/ui';

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
}

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(2, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
});

const categories = [
  { value: 'Academic', label: 'Academic' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Cultural', label: 'Cultural' },
  { value: 'Technical', label: 'Technical' },
  { value: 'Social', label: 'Social' },
  { value: 'Workshop', label: 'Workshop' },
];

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: event } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        date: event.event_date,
        // time: event.time,
        // location: event.location,
        // category: event.category,
        capacity: event.capacity,
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await eventsApi.update(id!, data);
      toast.success('Event updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      navigate('/admin/events');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
        <p className="mt-1 text-sm text-gray-600">Update event details</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Event Title" error={errors.title?.message} {...register('title')} />
          <Textarea label="Description" error={errors.description?.message} {...register('description')} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
            <Input label="Time" type="time" error={errors.time?.message} {...register('time')} />
          </div>
          <Input label="Location" error={errors.location?.message} {...register('location')} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Category" options={[{ value: '', label: 'Select category' }, ...categories]} error={errors.category?.message} {...register('category')} />
            <Input label="Capacity" type="number" error={errors.capacity?.message} {...register('capacity', { valueAsNumber: true })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>Save Changes</Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
