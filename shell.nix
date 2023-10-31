{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_16
  ];

  shellHook = ''
    # Set ZSH as your shell
    export SHELL=$(which zsh)
    exec $SHELL
  '';
}
