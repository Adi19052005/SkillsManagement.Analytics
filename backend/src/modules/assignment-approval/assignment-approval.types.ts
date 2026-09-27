export interface ApproveAssignmentInput {
  recommendationId: string;
}

export interface RejectAssignmentInput {
  recommendationId: string;
  reason?: string;
}

export interface AssignmentApprovalResult {
  recommendationId: string;
  taskId: string;
  employeeId: string;
  status: string;
  message: string;
}