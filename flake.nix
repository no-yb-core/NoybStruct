
{
  description = "NoybStruct development environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-26.05-darwin";

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-darwin";
      pkgs = import nixpkgs {
        inherit system;
        config.allowDeprecatedx86_64Darwin = true;
      };
    in {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs_24
          direnv
        ];
      };
    };
}
