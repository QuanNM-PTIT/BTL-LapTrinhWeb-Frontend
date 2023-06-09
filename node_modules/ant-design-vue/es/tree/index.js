import _extends from "@babel/runtime/helpers/esm/extends";
import Tree from './Tree';
import { TreeNode as VcTreeNode } from '../vc-tree';
import DirectoryTree from './DirectoryTree';
/* istanbul ignore next */
var TreeNode = VcTreeNode;
export { DirectoryTree, TreeNode };
export default _extends(Tree, {
  DirectoryTree: DirectoryTree,
  TreeNode: TreeNode,
  install: function install(app) {
    app.component(Tree.name, Tree);
    app.component(TreeNode.name, TreeNode);
    app.component(DirectoryTree.name, DirectoryTree);
    return app;
  }
});