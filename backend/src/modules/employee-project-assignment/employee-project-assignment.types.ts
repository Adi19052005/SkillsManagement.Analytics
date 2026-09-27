export interface CreateProjectAssignmentInput {
  employeeId: string;
  projectId: string;
  deliverableId: string;
}

export interface ReleaseProjectAssignmentInput {
  releasedAt?: string;
}