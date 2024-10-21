{
  description = "Flake to develop the CDapp using nix(OS)";

  inputs = {
    # node 20.11.0
    nixpkgs_node.url = "github:NixOS/nixpkgs/97b17f32362e475016f942bbdfda4a4a72a8a652";
  };

  outputs = {
    self,
    nixpkgs_node,
  }: {
    devShell.x86_64-linux = with nixpkgs_node.legacyPackages.x86_64-linux;
      mkShell {
        buildInputs = [nodejs_20 zsh];
        shellHook = "exec zsh";
      };
  };
}
