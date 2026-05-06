import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { eventsApi } from '../../api';
import { Button, Input, Textarea, Select } from '../../components/ui';

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

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: '', capacity: 100 },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await eventsApi.create(data);
      toast.success('Event created successfully!');
      navigate('/admin/events');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
        <p className="mt-1 text-sm text-gray-600">Add a new campus event</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Event Title" placeholder="Enter event title" error={errors.title?.message} {...register('title')} />
          <Textarea label="Description" placeholder="Describe the event..." error={errors.description?.message} {...register('description')} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
            <Input label="Time" type="time" error={errors.time?.message} {...register('time')} />
          </div>
          <Input label="Location" placeholder="e.g. Main Auditorium" error={errors.location?.message} {...register('location')} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Category" options={[{ value: '', label: 'Select category' }, ...categories]} error={errors.category?.message} {...register('category')} />
            <Input label="Capacity" type="number" placeholder="e.g. 100" error={errors.capacity?.message} {...register('capacity', { valueAsNumber: true })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>Create Event</Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
