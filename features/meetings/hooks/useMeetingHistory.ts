import { useMeetingsStore } from '@/store';

export const useMeetingHistory = () => {
  const { meetings, fetchMeetings, selectedMeeting, setSelectedMeeting } = useMeetingsStore();

  return {
    meetings,
    fetchMeetings,
    selectedMeeting,
    setSelectedMeeting,
  };
};
