
import api from './api';

// Team interfaces
export interface TeamMember {
  role: 'LEADER' | 'MEMBER';
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface MyTeam {
  id: string;
  name: string;
  invitationCode: string;
  competition: {
    event: {
      id: string;
      title: string;
      status: string;
    };
  };
  members: TeamMember[];
  submission: {
    id: string;
  } | null;
}

export interface MyTeamsResponse {
  success: boolean;
  data: MyTeam[];
}

// Get all teams for the current user
export const getMyTeams = async (): Promise<MyTeam[]> => {
  const response = await api.get<MyTeamsResponse>('/teams/my-teams');
  return response.data.data;
};

// Leave a team
export const leaveTeam = async (teamId: string) => {
  const response = await api.post(`/teams/${teamId}/leave`);
  return response.data;
};

// Remove a team member (leader action)
export const removeTeamMember = async (teamId: string, memberId: string) => {
  const response = await api.delete(`/teams/${teamId}/members/${memberId}`);
  return response.data;
};
