import { getCurrentUser } from "@/features/auth/current-user";
import {
  archiveProject,
  deleteProject,
  getProject,
  updateProject,
} from "@/features/projects/services/project-Id.service";
import { updateProjectSchema } from "@/features/projects/validations/project.validation";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { permissions } from "@/server/authorization/permissions";
import { requireOrganizationPermission } from "@/server/authorization/require-permission";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      projectId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId, projectId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.project.read,
    );

    const project = await getProject(projectId, organizationId);

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: "Project Fetched Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/organizations/:organizationId/projects/[projectId] failed:",
      error,
    );

    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        {
          success: false,
          error:
            error.status === 401
              ? "Unauthorized"
              : error.status === 404
                ? "Organization Not Found"
                : "Forbidden",
        },
        { status: error.status },
      );
    }

    if (error instanceof Error) {
      if (error.message === "Project Not Found") {
        return NextResponse.json(
          {
            success: false,
            error: "Project Not Found",
          },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Fetch Project",
      },
      { status: 500 },
    );
  }
}

// ########################### PATCH ########################

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: Promise<{ organizationId: string; projectId: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { organizationId, projectId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.project.update,
    );

    const body = await request.json();

    const result = await updateProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Input Validation Failed",
        },
        { status: 400 },
      );
    }

    const updatedProject = await updateProject(
      organizationId,
      projectId,
      result.data,
    );

    return NextResponse.json(
      {
        success: true,
        data: updatedProject,
        message: "Project Updated Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "PATCH /api/organizations/:organizationId/projects/[projectId] failed:",
      error,
    );

    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        {
          success: false,
          error:
            error.status === 401
              ? "Unauthorized"
              : error.status === 404
                ? "Organization Not Found"
                : "Forbidden",
        },
        { status: error.status },
      );
    }

    if (error instanceof Error) {
      if (error.message === "Project Not Found") {
        return NextResponse.json(
          {
            success: false,
            error: "Project Not Found",
          },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Update Project",
      },
      { status: 500 },
    );
  }
}

// ############ archive project by id ##################

export async function POST(
  _request: Request,
  {
    params,
  }: { params: Promise<{ organizationId: string; projectId: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { organizationId, projectId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.project.update,
    );

    const project = await archiveProject(organizationId, projectId);

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: "Project Archived Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "POST /api/organizations/:organizationId/projects/[projectId] failed:",
      error,
    );

    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        {
          success: false,
          error:
            error.status === 401
              ? "Unauthorized"
              : error.status === 404
                ? "Organization Not Found"
                : "Forbidden",
        },
        { status: error.status },
      );
    }

    if (error instanceof Error) {
      if (error.message === "Project Not Found") {
        return NextResponse.json(
          {
            success: false,
            error: "Project Not Found",
          },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Archive Project",
      },
      { status: 500 },
    );
  }
}

// ################# delete project by id ########################
export async function DELETE(
  _request: Request,
  {
    params,
  }: { params: Promise<{ organizationId: string; projectId: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { organizationId, projectId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.project.delete,
    );

    const deletedProject = await deleteProject(organizationId, projectId);

    return NextResponse.json(
      {
        success: true,
        data: deletedProject,
        message: "Project Deleted Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "DELETE /api/organizations/:organizationId/projects/[projectId] failed:",
      error,
    );

    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        {
          success: false,
          error:
            error.status === 401
              ? "Unauthorized"
              : error.status === 404
                ? "Organization Not Found"
                : "Forbidden",
        },
        { status: error.status },
      );
    }

    if (error instanceof Error) {
      if (error.message === "Project Not Found") {
        return NextResponse.json(
          {
            success: false,
            error: "Project Not Found",
          },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Delete Project",
      },
      { status: 500 },
    );
  }
}
