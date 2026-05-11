import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useParams, useNavigate } from "react-router-dom";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { eventsApi } from "../../api";

import {
  Button,
  Input,
  Textarea,
  Skeleton,
} from "../../components/ui";

/* ================================================= */
/* FORM TYPES */
/* ================================================= */

interface FormData {
  title: string;
  description: string;
  event_date: string;
  capacity: number;
}

/* ================================================= */
/* VALIDATION */
/* ================================================= */

const schema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  event_date: z
    .string()
    .min(1, "Event date is required"),

  capacity: z
    .number()
    .min(1, "Capacity must be at least 1"),
});

/* ================================================= */
/* COMPONENT */
/* ================================================= */

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);

  /* ================================================= */
  /* FETCH EVENT */
  /* ================================================= */

  const {
    data: event,
    isLoading,
  } = useQuery({
    queryKey: ["admin-event", id],

    queryFn: () =>
      eventsApi.getAdminEventById(id!),

    enabled: !!id,
  });

  /* ================================================= */
  /* FORM */
  /* ================================================= */

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  /* ================================================= */
  /* PREFILL FORM */
  /* ================================================= */

  useEffect(() => {
    if (event) {
      reset({
        title: event.title || "",

        description:
          event.description || "",

        event_date: event.event_date
          ? new Date(event.event_date)
              .toISOString()
              .split("T")[0]
          : "",

        capacity:
          Number(event.capacity) || 1,
      });
    }
  }, [event, reset]);

  /* ================================================= */
  /* SUBMIT */
  /* ================================================= */

  const onSubmit = async (
    data: FormData
  ) => {
    try {
      setLoading(true);

      await eventsApi.update(id!, data);

      toast.success(
        "Event updated successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-event", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-events"],
      });

      navigate("/admin/events");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update event"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================================= */
  /* LOADING */
  /* ================================================= */

  if (isLoading || !event) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />

        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  /* ================================================= */
  /* UI */
  /* ================================================= */

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Event
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Update your event details
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <Input
            label="Event Title"
            error={errors.title?.message}
            {...register("title")}
          />

          <Textarea
            label="Description"
            error={
              errors.description?.message
            }
            {...register("description")}
          />

          <Input
            label="Event Date"
            type="date"
            error={
              errors.event_date?.message
            }
            {...register("event_date")}
          />

          <Input
            label="Capacity"
            type="number"
            error={
              errors.capacity?.message
            }
            {...register("capacity", {
              valueAsNumber: true,
            })}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              loading={loading}
            >
              Save Changes
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