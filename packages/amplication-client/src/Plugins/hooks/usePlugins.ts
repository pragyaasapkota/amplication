import { useMutation, useQuery } from "@apollo/client";
import {
  GET_PLUGIN_INSTALLATIONS,
  CREATE_PLUGIN_INSTALLATION,
  UPDATE_PLUGIN_INSTALLATION,
} from "../queries/pluginsQueries";
import * as models from "../../models";
import { keyBy } from "lodash";
import { useContext, useMemo } from "react";
import { AppContext } from "../../context/appContext";

export type Plugin = {
  id: string;
  name: string;
  description: string;
  repo: string;
  npm: string;
  icon: string;
  github: string;
  website: string
  category: string;
  type: string;
};

const PLUGINS: Plugin[] = [
  {
    id: "@amplication/plugin-auth-jwt",
    description:
      "A Passport strategy for authenticating with a JSON Web Token (JWT).",
    icon: "",
    name: "Passport JWT Authentication",
    repo: "test",
    npm: "test",
    github: "test",
    website: "test",
    category: "test",
    type: "test",
  },
  {
    id: "@amplication/plugin-auth-basic",
    description:
      "A Passport strategy for authenticating using the standard basic HTTP scheme.",
    icon: "",
    name: "Passport Basic Authentication",
    repo: "test",
    npm: "test",
    github: "test",
    website: "test",
    category: "test",
    type: "test",
  },
  {
    id: "@amplication/plugin-monorepo-nx",
    description:
      "Add the required configurations and files to use nx to manage your monorepo",
    icon: "",
    name: "NX monorepo",
    repo: "test",
    npm: "test",
    github: "test",
    website: "test",
    category: "test",
    type: "test",
  },
  {
    id: "@amplication/plugin-db-postgres",
    description:
      "Connects your service to a PostgreSQL DB, and adds the required docker file",
    icon: "",
    name: "PostgreSQL DB",
    repo: "test",
    npm: "test",
    github: "test",
    website: "test",
    category: "test",
    type: "test",
  },
  {
    id: "@amplication/plugin-db-mongo",
    description:
      "Connects your service to a Mongo DB, and adds the required docker file",
    icon: "",
    name: "Mongo DB",
    repo: "test",
    npm: "test",
    github: "test",
    website: "test",
    category: "test",
    type: "test",
  },
  {
    id: "@amplication/plugin-db-mysql",
    description:
      "Connects your service to a mySQL, and adds the required docker file",
    icon: "",
    name: "MySQL DB",
    repo: "test",
    npm: "test",
    github: "test",
    website: "test",
    category: "test",
    type: "test",
  },
];

const usePlugins = (resourceId: string) => {
  const { addBlock } = useContext(AppContext);

  const {
    data: pluginInstallations,
    loading: loadingPluginInstallations,
    error: errorPluginInstallations,
  } = useQuery<{
    PluginInstallations: models.PluginInstallation[];
  }>(GET_PLUGIN_INSTALLATIONS, {
    variables: {
      resourceId: resourceId,
    },
  });

  const pluginCatalog = useMemo(() => {
    return keyBy(PLUGINS, (plugin) => plugin.id);
  }, []);

  const [updatePluginInstallation, { error: updateError }] = useMutation<{
    updatePluginInstallation: models.PluginInstallation;
  }>(UPDATE_PLUGIN_INSTALLATION, {
    onCompleted: (data) => {
      addBlock(data.updatePluginInstallation.id);
    },
    refetchQueries: [
      {
        query: GET_PLUGIN_INSTALLATIONS,
        variables: {
          resourceId: resourceId,
        },
      },
    ],
  });

  const [createPluginInstallation, { error: createError }] = useMutation<{
    createPluginInstallation: models.PluginInstallation;
  }>(CREATE_PLUGIN_INSTALLATION, {
    onCompleted: (data) => {
      addBlock(data.createPluginInstallation.id);
    },
    refetchQueries: [
      {
        query: GET_PLUGIN_INSTALLATIONS,
        variables: {
          resourceId: resourceId,
        },
      },
    ],
  });

  return {
    pluginInstallations,
    loadingPluginInstallations,
    errorPluginInstallations,
    updatePluginInstallation,
    updateError,
    createPluginInstallation,
    createError,
    pluginCatalog,
  };
};

export default usePlugins;
