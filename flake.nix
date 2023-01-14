{
  description = "Denocord Discord Bot";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};

      deps = with pkgs; [
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
      
      # The thing that runs starbot
      starBot = pkgs.writeShellApplication {
        name = "starbot";
        runtimeInputs = deps;
        text = ''
          deno run -A main.js
        '';
      };

      mkImage = (tag: pkgs.dockerTools.buildImage {
        name = "starbot";
        tag = "${tag}";
        copyToRoot = pkgs.buildEnv {
          name = "starbot-root";
          paths = [ starBot pkgs.bashInteractive ];
          pathsToLink = [
            "/bin"
          ];
        };
      });
      
    in {
      apps.default = {
        type = "app";
        program = "${starBot}/bin/starbot";
      };
      
      packages.StarBot = mkImage "latest";

      packages.StarBot-Test = mkImage "dev";
      
      devShells.default = pkgs.mkShell {
        nativeBuildInputs = [ pkgs.bashInteractive ];
        buildInputs = deps;
      };
    });
}
