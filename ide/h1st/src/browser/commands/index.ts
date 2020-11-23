import { Command } from "@theia/core/lib/common";
import { WorkspaceCommands } from "@theia/workspace/lib/browser";

export const H1stNewModelCommand: Command = {
  id: "h1st.model.new.command",
  label: "New Model",
};

export const H1stNewNotebookCommand: Command = {
  id: "h1st.notebook.new.command",
  label: "New Notebook",
};

export const H1stOpenWorkspace: Command = {
  id: WorkspaceCommands.OPEN_WORKSPACE.id,
  label: WorkspaceCommands.OPEN_WORKSPACE.label,
};

export const H1stOpenShareCommand: Command = {
  id: "h1st.share.open",
  label: "Share",
};
