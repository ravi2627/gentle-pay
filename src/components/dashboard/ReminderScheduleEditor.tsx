import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Plus,
  Trash2,
  GripVertical,
  Mail,
  MessageSquare,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ReminderFormItem,
  ReminderTimingType,
  ReminderChannel,
  ReminderTone,
} from "@/types/invoiceReminders";
import {
  DEFAULT_REMINDERS,
  MAX_REMINDERS,
  TIMING_OPTIONS,
  getReminderTimingLabel,
  getChannelLabel,
  getToneLabel,
} from "@/types/invoiceReminders";

interface ReminderScheduleEditorProps {
  reminders: ReminderFormItem[];
  onChange: (reminders: ReminderFormItem[]) => void;
  clientHasPhone?: boolean;
  compact?: boolean;
}

export function ReminderScheduleEditor({
  reminders,
  onChange,
  clientHasPhone = false,
  compact = false,
}: ReminderScheduleEditorProps) {
  const canAddReminder = reminders.length < MAX_REMINDERS;

  const addReminder = () => {
    if (!canAddReminder) return;

    const newReminder: ReminderFormItem = {
      id: `new-${Date.now()}`,
      timing_type: "after",
      timing_days: 3,
      channel: "email",
      tone: "professional",
    };

    onChange([...reminders, newReminder]);
  };

  const removeReminder = (id: string) => {
    onChange(reminders.filter((r) => r.id !== id));
  };

  const updateReminder = (id: string, updates: Partial<ReminderFormItem>) => {
    onChange(
      reminders.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const handleTimingChange = (id: string, value: string) => {
    const option = TIMING_OPTIONS.find(
      (o) => `${o.type}-${o.days}` === value
    );
    if (option) {
      updateReminder(id, {
        timing_type: option.type,
        timing_days: option.days,
      });
    }
  };

  const resetToDefaults = () => {
    onChange([...DEFAULT_REMINDERS]);
  };

  const getChannelIcon = (channel: ReminderChannel) => {
    switch (channel) {
      case "email":
        return <Mail className="h-3.5 w-3.5" />;
      case "sms":
        return <MessageSquare className="h-3.5 w-3.5" />;
      case "both":
        return (
          <div className="flex gap-0.5">
            <Mail className="h-3 w-3" />
            <MessageSquare className="h-3 w-3" />
          </div>
        );
    }
  };

  const getToneBadgeVariant = (tone: ReminderTone) => {
    switch (tone) {
      case "polite":
        return "secondary";
      case "professional":
        return "default";
      case "firm":
        return "destructive";
    }
  };

  if (compact) {
    // Compact view for read-only display
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Bell className="h-4 w-4 text-primary" />
          <span>Scheduled Reminders ({reminders.length})</span>
        </div>
        <div className="space-y-1.5 pl-6">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              {getChannelIcon(reminder.channel)}
              <span>{getReminderTimingLabel(reminder.timing_type, reminder.timing_days)}</span>
              <Badge variant={getToneBadgeVariant(reminder.tone)} className="text-xs">
                {getToneLabel(reminder.tone)}
              </Badge>
            </div>
          ))}
          {reminders.length === 0 && (
            <p className="text-sm text-muted-foreground">No reminders scheduled</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <Label className="font-semibold">Reminder Schedule</Label>
          <Badge variant="outline" className="ml-2">
            {reminders.length}/{MAX_REMINDERS}
          </Badge>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={resetToDefaults}
          className="text-xs"
        >
          Reset to defaults
        </Button>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder, index) => (
          <Card key={reminder.id} className="border-muted">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-1 pt-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-xs font-medium w-4">{index + 1}</span>
                </div>

                <div className="flex-1 grid gap-3 sm:grid-cols-3">
                  {/* Timing */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">When</Label>
                    <Select
                      value={`${reminder.timing_type}-${reminder.timing_days}`}
                      onValueChange={(v) => handleTimingChange(reminder.id, v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMING_OPTIONS.map((option) => (
                          <SelectItem
                            key={`${option.type}-${option.days}`}
                            value={`${option.type}-${option.days}`}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Channel */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Channel</Label>
                    <Select
                      value={reminder.channel}
                      onValueChange={(v: ReminderChannel) =>
                        updateReminder(reminder.id, { channel: v })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </div>
                        </SelectItem>
                        <SelectItem value="sms" disabled={!clientHasPhone}>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            SMS
                            {!clientHasPhone && (
                              <span className="text-xs text-muted-foreground">
                                (no phone)
                              </span>
                            )}
                          </div>
                        </SelectItem>
                        <SelectItem value="both" disabled={!clientHasPhone}>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              <Mail className="h-4 w-4" />
                              <MessageSquare className="h-4 w-4 -ml-1" />
                            </div>
                            Both
                            {!clientHasPhone && (
                              <span className="text-xs text-muted-foreground">
                                (no phone)
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tone */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Tone</Label>
                    <Select
                      value={reminder.tone}
                      onValueChange={(v: ReminderTone) =>
                        updateReminder(reminder.id, { tone: v })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="polite">
                          <span className="flex items-center gap-2">
                            😊 Polite
                          </span>
                        </SelectItem>
                        <SelectItem value="professional">
                          <span className="flex items-center gap-2">
                            💼 Professional
                          </span>
                        </SelectItem>
                        <SelectItem value="firm">
                          <span className="flex items-center gap-2">
                            ⚠️ Firm
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => removeReminder(reminder.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {reminders.length === 0 && (
          <div className="text-center py-6 text-muted-foreground border rounded-lg border-dashed">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No reminders scheduled</p>
            <p className="text-xs mt-1">Add up to {MAX_REMINDERS} reminders</p>
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addReminder}
        disabled={!canAddReminder}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Reminder
        {!canAddReminder && ` (max ${MAX_REMINDERS})`}
      </Button>

      {!clientHasPhone && reminders.some((r) => r.channel !== "email") && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          SMS requires client phone number. Some reminders will be email-only.
        </p>
      )}
    </div>
  );
}
