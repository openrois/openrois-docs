---
sidebar_label: Citing and License
sidebar_position: 4
description: How to cite OpenRoIS in academic work, and the license and trademarks that apply.
---

# Citing and License

## Citing OpenRoIS

The position paper describing OpenRoIS was submitted to SII 2027 and is under review. Its
preprint has been submitted to arXiv and will be linked here once it is announced.

```bibtex
@misc{carrera2026openrois,
  author    = {Carrera Villalobos, Sebastian and Arellano, Christopher Nolan and
               Hitzmann, Arne and Morais Brito, Edilson and Utsumi, Akira and
               Horikawa, Yukiko and Miyashita, Takahiro and El Hafi, Lotfi},
  title     = {{OpenRoIS}: A Community-Driven Open-Source Middleware Implementing
               the Robotic Interaction Service ({RoIS}) Framework for Physical
               Robots and Virtual Agents},
  year      = {2026},
  note      = {Submitted to the 2027 IEEE/SICE International Symposium on
               System Integration (SII 2027). Preprint on arXiv, forthcoming.}
}
```

If you use OpenRoIS in your research, please also cite the software. The repository provides
the same information in machine-readable form in
[`CITATION.cff`](https://github.com/openrois/openrois/blob/dev/CITATION.cff), which GitHub
turns into a "Cite this repository" button.

```bibtex
@software{openrois,
  author  = {{OpenRoIS Community}},
  title   = {{OpenRoIS}: Open-Source Middleware Implementing the {OMG}
             Robotic Interaction Service ({RoIS}) Framework 2.0},
  url     = {https://openrois.org/},
  version = {0.1.0-alpha.2},
  license = {Apache-2.0},
  year    = {2026}
}
```

When your work depends on the standard itself, please also cite the specification:

```bibtex
@techreport{omg_rois_2026,
  author      = {{Object Management Group}},
  title       = {Robotic Interaction Service ({RoIS}) Framework, Version 2.0},
  institution = {Object Management Group},
  number      = {formal/26-06-03},
  year        = {2026},
  month       = jun,
  url         = {https://www.omg.org/spec/RoIS/2.0}
}
```

## License

OpenRoIS source code, interface types, and documentation are released under the
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). Copyright 2026
Coarobo GK. OpenRoIS is developed by Coarobo GK and the OpenRoIS community.

The normative RoIS specification and its machine-readable files are published by the Object
Management Group under their own terms. OpenRoIS does not redistribute or modify them.

## Trademarks

OpenRoIS is a trademark of Coarobo GK. RoIS and OMG are trademarks of the Object Management
Group. Other names are trademarks of their respective owners and are used for
identification only.
