{
  description = "Denocord Discord Bot";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      # D2 Lang for graphs
      d2lang = pkgs.buildGoModule rec {
        pname = "d2lang";
        version = "0.1.4-2023-01-05";
        src = pkgs.fetchFromGitHub {
          owner = "terrastruct";
          repo = "d2";
          rev = "80892f9ff9317b709d7176a6bffbbd4ca92bf9a3";
          sha256 = "nG4elO7yA58XXCs74Y1CPulYcr7OfeaEA9N7Bfa/X0Y=";
        };
        vendorHash = "sha256-t94xCNteYRpbV2GzrD4ppD8xfUV1HTJPkipEzr36CaM=";
        doCheck = false;
      };
      # The thing that runs starbot
      starBot = pkgs.writeShellApplication {
        name = "starbot";
        runtimeInputs = with pkgs; [
          deno
          # Graphs
          d2lang
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
          d2lang
          librsvg
          cbqn
        ];
      };
    });
}
