import { getCurrentUser } from "@/features/auth/current-user";
import { createProject } from "@/features/projects/services/createProject.service";
import { listProjects } from "@/features/projects/services/listProjects.service";
import { projectSchema } from "@/features/projects/validations/project.validation";
import { paginationQuerySchema } from "@/lib/pagination/pagination";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { permissions } from "@/server/authorization/permissions";
import { requireOrganizationPermission } from "@/server/authorization/require-permission";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.project.read,
    );

    const { searchParams } = new URL(request.url);

    const paginationResult = paginationQuerySchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!paginationResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const result = await listProjects(
      user.id,
      organizationId,
      paginationResult.data,
      { status: "ACTIVE" },
    );

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: "Projects Fetched Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/organizations/:organizationId/projects failed:",
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

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Fetch Projects",
      },
      { status: 500 },
    );
  }
}

// ######################### POST ###########################

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
    }>;
  },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthorizationError("Unauthorized", 401);
    }

    const { organizationId } = await params;

    await requireOrganizationPermission(
      user.id,
      organizationId,
      permissions.project.create,
    );

    const body = await request.json();

    const result = projectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Input Validation Failed",
        },
        { status: 400 },
      );
    }

    const project = await createProject(user.id, organizationId, result.data);

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: "Project Created Successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/organizations/:organizationId/projects failed:",
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

    return NextResponse.json(
      {
        success: false,
        error: "Failed To Create Project",
      },
      { status: 500 },
    );
  }
}
