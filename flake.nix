{
  description = "Denocord Discord Bot";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      # The thing that runs starbot
      starBot = pkgs.writeShellApplication {
        name = "starbot";
        runtimeInputs = with pkgs; [
          deno
          # Graphs
          d2
          # Convert SVG to PNG on the fly D2 when parsing outputing
          # via stdout only does SVG, hence to send over Discord we
          # cheat and convert to PNG.
          librsvg
          # Funny WingDing Language
          cbqn
        ];
        text = ''
          deno run -A main.js
        '';
      };
    in {
      apps.default = {
        type = "app";
        program = "${starBot}/bin/starbot";
      };
      devShells.default = pkgs.mkShell {
        nativeBuildInputs = [ pkgs.bashInteractive ];
        buildInputs = with pkgs; [
          deno
          d2
          librsvg
          cbqn
        ];
      };
    });
}
