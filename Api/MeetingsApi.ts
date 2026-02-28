import { AxiosInstance } from 'axios';

export type TeamInfo<T extends object = NonNullable<unknown>> = {
  id: number;
  name: string;
  self_serviceable: boolean;
  visible: boolean;
  visible_on_kiosk: boolean;
  attendable: boolean;
  description: string;
  mailing_list_name: string | null;
  slack_channel_id: string;
  slack_channel_name: string; 
  slack_private_channel_id: string;
  google_group: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
} & T;

export type EventInfo<T extends object = NonNullable<unknown>> = {
  id: number;
  name: string;
  allow_anonymous_rsvp: boolean;
  location: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
} & T;

export type AttendanceInfo<T extends object = NonNullable<unknown>> = {
  attendable_type: string;
  attendable_id: number;
  gtid: number;
  source: string;
} & T;

// TODO: Fill this in with proper attendance response params
export type AttendanceResponse = {
  attendance: {
    attendee?: {
      name: string;
    };
  };
};

export async function getTeamInfo(api: AxiosInstance): Promise<TeamInfo[] | null> {
  try {
    const teams = await api.get('/api/v1/teams');
    //TODO: Incorporate Sentry
    const teamInfos: TeamInfo[] = teams.data.teams;
    return teamInfos;
  } catch (error) {
    //TODO: incorporate logging
  }
  return null;
}

export async function getEventInfo(api: AxiosInstance): Promise<EventInfo[] | null> {
  try {
    const events = await api.get('/api/v1/events');
    //TODO: Incorporate Sentry
    const eventInfos: EventInfo[] = events.data.events;
    return eventInfos;
  } catch (error) {
    //TODO: incorporate logging
  }
  return null;
}

export async function postAttendance(
  api: AxiosInstance, 
  props: AttendanceInfo
): Promise<{ success: true; data: AttendanceResponse } | { success: false; error: string }> {
  try {
    console.log("Posting ", props);
    const response = await api.post('/api/v1/attendance?include=attendee', props);
    console.log('Attendance response:', response.data);
    
    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    //TODO: incorporate logging
    console.error(error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}