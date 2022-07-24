import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import get from "lodash.get";
import * as models from "../../models";
import { CREATE_PROJECT, GET_PROJECTS } from "../queries/projectQuery";

const useProjectSelector = (
  authenticated: boolean,
  currentWorkspace: models.Workspace | undefined
) => {
  const history = useHistory();
  const workspaceMatch: {
    params: { workspace: string };
  } | null = useRouteMatch("/:workspace([A-Za-z0-9-]{20,})");
  const projectMatch: {
    params: { workspace: string; project: string };
  } | null = useRouteMatch(
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})"
  );
  const project = get(projectMatch, "params.project", null);
  const workspace = get(
    projectMatch,
    "params.workspace",
    workspaceMatch?.params.workspace
  );
  const [currentProject, setCurrentProject] = useState<models.Project>();
  const [projectsList, setProjectList] = useState<models.Project[]>([]);

  const { data: projectListData, loading: loadingList, refetch } = useQuery(
    GET_PROJECTS,
    {
      skip: !workspace || currentWorkspace?.id !== workspace,
      onError: (error) => {
        // if error push to ? check with @Yuval
      },
    }
  );

  const projectRedirect = useCallback(
    (projectId: string) =>
      history.push(`/${currentWorkspace?.id || workspace}/${projectId}`),
    [currentWorkspace?.id, history, workspace]
  );

  const [setNewProject] = useMutation<models.ProjectCreateInput>(
    CREATE_PROJECT
  );

  const createProject = (data: models.ProjectCreateInput) => {
    setNewProject({ variables: data });
  };

  const onNewProjectCompleted = useCallback(
    (data: models.Project) => {
      refetch().then(() => projectRedirect(data.id));
    },
    [projectRedirect, refetch]
  );

  useEffect(() => {
    if (loadingList || !projectListData) return;

    setProjectList(projectListData.projects);
  }, [projectListData, loadingList]);

  useEffect(() => {
    if (project || !projectsList.length) return;

    projectRedirect(projectsList[0].id);
  }, [history, project, projectRedirect, projectsList, workspace]);

  useEffect(() => {
    if (!project || !projectsList.length) return;

    const selectedProject = projectsList.find(
      (projectDB: models.Project) => projectDB.id === project
    );
    if (!selectedProject) projectRedirect(projectsList[0].id);
    console.log('setCurrentProject')
    setCurrentProject(selectedProject);
  }, [project, projectRedirect, projectsList]);

  return {
    currentProject,
    projectsList,
    createProject,
    onNewProjectCompleted,
  };
};

export default useProjectSelector;
