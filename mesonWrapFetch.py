from glob import glob
from mesonbuild.wrap.wrap import PackageDefinition
import sys

print("{ pkgs, ... }: {")

for wrap in glob(f"{sys.argv[1]}/subprojects/*.wrap"):
    wrap = PackageDefinition(wrap)

    if wrap.wrap_section == "wrap-file":
        print(f"""  "{wrap.values['source_filename']}" = pkgs.fetchurl {{
    url = "{wrap.values['source_url']}";
    sha256 = "{wrap.values['source_hash']}";
  }};""")
        

print("}")
