import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ThemedImage from '@theme/ThemedImage';

import styles from './index.module.css';

const GITHUB_ORG = 'https://github.com/openrois';
const GITHUB_REPO = 'https://github.com/openrois/openrois';
const ROIS_SPEC = 'https://www.omg.org/spec/RoIS/2.0';
// The arXiv abstract URL of the paper. Empty until the preprint is announced
// (submitted 2026-09-17 as arXiv:submit/8095926), which renders "coming soon".
const PAPER_URL = '';

const HERO_CODE = `import { RoISClient } from "@openrois/sdk";

const client = await RoISClient.connect("wss://example.org");

// Same calls for a robot, an avatar, or a service.
const [nav] = await client.search();
await client.subscribe(nav, "reached_target");
await client.bind(nav);
await client.execute(nav, { command_type: "start" });`;

const APP_CODE = `import { RoISClient } from "@openrois/sdk";

const client = await RoISClient.connect("ws://localhost:8765");
const nav = "robot_1/Navigation";

// Discover components across every connected robot.
const refs = await client.search();

// Read state synchronously.
const status = await client.query(nav, "component_status");

// React to events.
client.on("reached_target", (n) => console.log(n.params));
await client.subscribe(nav, "reached_target");

// Reserve an actuation component, command it, release it.
await client.bind(nav);
await client.setParameter(nav, [
  { name: "target_positions", data_type_ref: "string[]", value: '["kitchen"]' },
]);
await client.execute(nav, { command_type: "start" });
await client.release(nav);`;

const COMPONENT_CODE = `from openrois.interfaces.bus import InvokeResponse
from openrois.interfaces.hri import ReturnCode
from openrois_components_core import component, invoke, query, results, subscribe


@component("Navigation", function="actuation")
class Navigation:
    """Translates RoIS Navigation into calls to your robot's own API."""

    def __init__(self, config: dict) -> None:
        self._robot_url = config["robot_url"]

    async def connect(self) -> None:
        self._robot = await MyRobotClient.open(self._robot_url)

    @query("component_status")
    async def status(self):
        return results.status("BUSY" if self._robot.moving else "READY")

    @invoke("start")
    async def start(self, parameters):
        await self._robot.go_to(parameters)
        return InvokeResponse(return_code=ReturnCode.OK, command_id="nav-1")

    @subscribe("reached_target")
    async def on_reached_target(self):
        """Registers the event. Emit it with self.parent.emit_async(...)."""`;

const WIRE_CODE = `// Service application to gateway
{ "jsonrpc": "2.0", "id": 7, "method": "rois.command.bind",
  "params": { "component_ref": "robot_1/Navigation" } }

{ "jsonrpc": "2.0", "id": 7, "result": { "return_code": "OK" } }

// Gateway to service application, pushed when the robot arrives
{ "jsonrpc": "2.0", "method": "rois.event.notify",
  "params": {
    "subscribe_id": "sub-3f2a",
    "event_type": "reached_target",
    "results": [
      { "name": "target", "data_type_ref": "string", "value": "kitchen" },
      { "name": "is_final_target", "data_type_ref": "bool", "value": "true" }
    ] } }`;

type Feature = {tag: string; title: string; body: ReactNode; to: string};

const FEATURES: Feature[] = [
  {
    tag: 'Engine',
    title: 'Recursive Engine',
    body: (
      <>
        One <code>Engine</code> class realizes both the main and the sub HRI Engine roles of
        RoIS. The gateway and every adapter share a single dispatch implementation.
      </>
    ),
    to: '/docs/concepts/recursive-engine',
  },
  {
    tag: 'Contract',
    title: 'Five-Method Component Contract',
    body: (
      <>
        <code>discover</code>, <code>invoke</code>, <code>query</code>, <code>subscribe</code>,
        and <code>unsubscribe</code>. ROS 2, gRPC, and game engines stay inside adapters.
      </>
    ),
    to: '/docs/concepts/component-contract',
  },
  {
    tag: 'Protocol',
    title: 'JSON-RPC 2.0 over WebSocket',
    body: (
      <>
        Every operation of the five RoIS interfaces maps to a namespaced method. The control
        plane works from browsers and across the internet.
      </>
    ),
    to: '/docs/reference/wire-protocol',
  },
  {
    tag: 'Types',
    title: 'Single Source of Truth',
    body: (
      <>
        RoIS types are authored once in Python, exported to JSON Schema, and generated into
        TypeScript and C#, and checked locally against the normative RoIS files.
      </>
    ),
    to: '/docs/concepts/type-pipeline',
  },
  {
    tag: 'Profiles',
    title: 'Profile-Driven Applications',
    body: (
      <>
        Applications discover components, commands, queries, and events at runtime, so one
        application works with any platform behind the gateway.
      </>
    ),
    to: '/docs/guides/service-application',
  },
  {
    tag: 'Components',
    title: 'Decorator-Based Components',
    body: (
      <>
        Declare a component with <code>@component</code>, <code>@query</code>,{' '}
        <code>@invoke</code>, and <code>@subscribe</code>. Write only the code that talks to
        your robot.
      </>
    ),
    to: '/docs/guides/components-and-adapters',
  },
];

type RoisInterface = {name: string; ns: string; ops: string[]; planned?: boolean};

const INTERFACES: RoisInterface[] = [
  {name: 'System', ns: 'rois.system.*', ops: ['connect', 'disconnect', 'get_profile']},
  {name: 'Command', ns: 'rois.command.*', ops: ['search', 'bind', 'set_parameter', 'execute', 'release']},
  {name: 'Query', ns: 'rois.query.*', ops: ['query']},
  {name: 'Event', ns: 'rois.event.*', ops: ['subscribe', 'unsubscribe', 'notify']},
  {
    name: 'Streaming',
    ns: 'rois.stream.*',
    ops: ['connect_stream', 'suspend_stream'],
    planned: true,
  },
];

type StatusGroup = {label: string; kind: 'available' | 'progress' | 'planned'; items: string[]};

const STATUS: StatusGroup[] = [
  {
    label: 'Available',
    kind: 'available',
    items: [
      'RoIS interface types in Python, JSON Schema, TypeScript, and C#',
      'Recursive engine, WebSocket server and client, and component framework (Python)',
      'TypeScript client SDK and profile-driven web inspector',
      'Reference components for the Preferred Robotics Kachaka (gRPC, ROS 2)',
    ],
  },
  {
    label: 'In Progress',
    kind: 'progress',
    items: [
      'C# client SDK for Unity',
      'Reliability fixes for adapter discovery and event delivery in the gateway',
      'Regression test suite for the engine core',
    ],
  },
  {
    label: 'Planned',
    kind: 'planned',
    items: [
      'Open reference platform based on the Pollen Robotics Reachy Mini',
      'Authentication (JWT) and authorization (RBAC)',
      'Streaming Interface with WebRTC media',
      'Packages on PyPI, npm, NuGet, and UPM',
      'All 17 basic RoIS HRI Components (v1.0)',
    ],
  },
];

const STANDARDS = ['OMG RoIS 2.0', 'JSON-RPC 2.0', 'WebSocket', 'JSON Schema', 'ROS 2', 'Unity'];

const PAPER_BIBTEX = `@misc{carrera2026openrois,
  author    = {Carrera Villalobos, Sebastian and Arellano, Christopher Nolan and
               Hitzmann, Arne and Morais Brito, Edilson and Utsumi, Akira and
               Horikawa, Yukiko and Miyashita, Takahiro and El Hafi, Lotfi},
  title     = {{OpenRoIS}: A Community-Driven Open-Source Middleware Implementing
               the Robotic Interaction Service ({RoIS}) Framework for Physical
               Robots and Virtual Agents},
  year      = {2026},
  note      = {Submitted to the 2027 IEEE/SICE International Symposium on
               System Integration (SII 2027). Preprint on arXiv, forthcoming.}
}`;

const BIBTEX = `@software{openrois,
  author  = {{OpenRoIS Community}},
  title   = {{OpenRoIS}: Open-Source Middleware Implementing the {OMG}
             Robotic Interaction Service ({RoIS}) Framework 2.0},
  url     = {https://openrois.org/},
  version = {0.1.0-alpha.2},
  license = {Apache-2.0},
  year    = {2026}
}`;

function GitHubIcon(): ReactNode {
  return (
    <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

function PaperIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}

function SpecIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </svg>
  );
}

function HeroLinks(): ReactNode {
  return (
    <div className={styles.heroLinks}>
      <Link className={styles.heroLink} href={GITHUB_ORG}>
        <GitHubIcon />
        <span>OpenRoIS GitHub Organization</span>
      </Link>
      {PAPER_URL ? (
        <Link className={styles.heroLink} href={PAPER_URL}>
          <PaperIcon />
          <span>OpenRoIS arXiv Preprint</span>
        </Link>
      ) : (
        <span className={clsx(styles.heroLink, styles.heroLinkSoon)} title="The preprint has been submitted to arXiv and will be linked here once it is announced.">
          <PaperIcon />
          <span>OpenRoIS arXiv Preprint</span>
          <em>Coming Soon</em>
        </span>
      )}
      <Link className={styles.heroLink} href={ROIS_SPEC}>
        <SpecIcon />
        <span>OMG RoIS Specification</span>
      </Link>
    </div>
  );
}

function Hero(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className={clsx('container', styles.heroInner)}>
        <div className={styles.heroText}>
          <div className={styles.eyebrow}>
            <a href={ROIS_SPEC} className={styles.eyebrowItem}>
              OMG RoIS 2.0
            </a>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrowItem}>Apache-2.0</span>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrowItem}>Alpha</span>
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            One Standard Interface for <span className={styles.gradient}>Robots, Avatars, and AI Services</span>
          </Heading>
          <p className={styles.heroLead}>
            OpenRoIS is open-source middleware implementing the OMG Robotic Interaction Service
            (RoIS) Framework 2.0. Service applications control physical robots, virtual avatars,
            and AI services through standard, symbolic interfaces, locally or over the internet.
          </p>
          <div className={styles.heroButtons}>
            <Link className={clsx('button button--primary button--lg', styles.cta)} to="/docs/getting-started/quickstart">
              Get Started
            </Link>
            <Link className={clsx('button button--secondary button--lg', styles.ctaSecondary)} to="/docs/intro">
              Documentation
            </Link>
          </div>
          <HeroLinks />
        </div>
        <div className={styles.heroCode}>
          <div className={styles.window}>
            <div className={styles.windowBar}>
              <span />
              <span />
              <span />
              <em>app.ts</em>
            </div>
            <CodeBlock language="ts" className={styles.windowCode}>
              {HERO_CODE}
            </CodeBlock>
          </div>
        </div>
      </div>
      <div className={clsx('container', styles.heroDemo)}>
        <figure className={styles.demoFigure}>
          <div className={styles.window}>
            <div className={styles.windowBar}>
              <span />
              <span />
              <span />
              <em>examples/hri-client</em>
            </div>
            <video
              className={styles.demoVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={useBaseUrl('/video/hri-client-demo-poster.jpg')}
              aria-label="Screen recording of the OpenRoIS HRI Client connecting to the mock engine, querying components, subscribing to events, and executing a command.">
              <source src={useBaseUrl('/video/hri-client-demo.webm')} type="video/webm" />
              <source src={useBaseUrl('/video/hri-client-demo.mp4')} type="video/mp4" />
            </video>
          </div>
          <figcaption>
            Recorded from the quickstart setup, with no robot attached.{' '}
            <Link to="/docs/getting-started/quickstart">Run It Yourself in a Few Minutes →</Link>
          </figcaption>
        </figure>
      </div>
    </header>
  );
}

function Why(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>Why OpenRoIS</span>
          <Heading as="h2">Write the Application Once. Integrate Each Platform Once.</Heading>
          <p>
            Service applications for human-robot interaction are usually written against the
            interface of one platform, so every change of hardware forces a rewrite. RoIS 2.0
            standardizes the interaction at the symbolic level, and OpenRoIS provides the
            maintained implementation, SDKs, and adapters that the standard needs in practice.
          </p>
        </div>
        <figure className={styles.figure}>
          <ThemedImage
            alt="Without a standard interface, N applications and M platforms need N times M integrations. With OpenRoIS, they need N plus M."
            sources={{
              light: useBaseUrl('/img/openrois-concept.svg'),
              dark: useBaseUrl('/img/openrois-concept-dark.svg'),
            }}
          />
        </figure>
      </div>
    </section>
  );
}

function Features(): ReactNode {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>What OpenRoIS Provides</span>
          <Heading as="h2">The Building Blocks for Putting RoIS to Work</Heading>
        </div>
        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <Link key={f.title} to={f.to} className={styles.featureCard}>
              <span className={styles.tag}>{f.tag}</span>
              <Heading as="h3">{f.title}</Heading>
              <p>{f.body}</p>
              <span className={styles.more}>Learn more →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Interfaces(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>The Five RoIS Interfaces</span>
          <Heading as="h2">Standard Operations over <span className={styles.nowrap}>JSON-RPC 2.0</span></Heading>
          <p>
            RoIS 2.0 defines what a service application can ask of an HRI Engine. OpenRoIS maps each
            operation onto a JSON-RPC 2.0 method, with requests, responses, and asynchronous
            notifications over one WebSocket connection.
          </p>
        </div>
        <div className={styles.interfaceGrid}>
          {INTERFACES.map((i) => (
            <div key={i.name} className={styles.interfaceCard}>
              <div className={styles.interfaceHead}>
                <Heading as="h3">{i.name}</Heading>
                {i.planned && <span className="status-pill status-pill--planned">Planned</span>}
              </div>
              <code className={styles.ns}>{i.ns}</code>
              <ul>
                {i.ops.map((op) => (
                  <li key={op}>
                    <code>{op}</code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.centerLink}>
          <Link to="/docs/reference/wire-protocol">Read the Wire Protocol Reference →</Link>
        </div>
      </div>
    </section>
  );
}

function Architecture(): ReactNode {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>Architecture</span>
          <Heading as="h2">The RoIS Model, Realized as Processes You Can Deploy</Heading>
          <p>
            The gateway hosts the main HRI Engine. Each adapter hosts a sub HRI Engine for one robot,
            avatar, or service, and reaches it through the transport that platform requires. Media
            stays on a separate data plane.
          </p>
        </div>
        <figure className={styles.figure}>
          <ThemedImage
            alt="OpenRoIS architecture: service applications, the gateway hosting the main HRI Engine, adapters hosting sub HRI Engines, and their hosts."
            sources={{
              light: useBaseUrl('/img/openrois-architecture.svg'),
              dark: useBaseUrl('/img/openrois-architecture-dark.svg'),
            }}
          />
        </figure>
        <div className={styles.centerLink}>
          <Link to="/docs/concepts/architecture">Explore the Architecture →</Link>
        </div>
      </div>
    </section>
  );
}

function Code(): ReactNode {
  return (
    <section className={styles.section}>
      <div className={clsx('container', styles.codeSection)}>
        <div className={styles.codeText}>
          <span className={styles.kicker}>For Developers</span>
          <Heading as="h2">Build on Either Side of the Standard</Heading>
          <p>
            Application developers use an SDK to address any platform through the RoIS interfaces.
            Robot developers write components that translate those interfaces into calls to their
            own stack, and the adapter framework handles the rest.
          </p>
          <ul className={styles.checkList}>
            <li>TypeScript SDK for web and Node.js applications</li>
            <li>C# SDK for Unity applications (in progress)</li>
            <li>Python adapter SDK with ROS 2 support</li>
          </ul>
          <Link className="button button--primary" to="/docs/getting-started/quickstart">
            Run the Quickstart
          </Link>
        </div>
        <div className={styles.codeTabs}>
          <Tabs>
            <TabItem value="app" label="Service Application">
              <CodeBlock language="ts">{APP_CODE}</CodeBlock>
            </TabItem>
            <TabItem value="component" label="Component">
              <CodeBlock language="python">{COMPONENT_CODE}</CodeBlock>
            </TabItem>
            <TabItem value="wire" label="On the Wire">
              <CodeBlock language="json">{WIRE_CODE}</CodeBlock>
            </TabItem>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

function Status(): ReactNode {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>Project Status</span>
          <Heading as="h2">Built in the Open, One Capability at a Time</Heading>
          <p>
            OpenRoIS is alpha software with an unstable API. The foundations are in place and
            demonstrated with a physical robot. The rest of the RoIS surface follows a public roadmap.
          </p>
        </div>
        <div className={styles.statusGrid}>
          {STATUS.map((g) => (
            <div key={g.label} className={styles.statusCard}>
              <span className={clsx('status-pill', `status-pill--${g.kind}`)}>{g.label}</span>
              <ul>
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.centerLink}>
          <Link to="/docs/project/roadmap">See the Full Roadmap →</Link>
        </div>
      </div>
    </section>
  );
}

function Community(): ReactNode {
  return (
    <section className={styles.section}>
      <div className={clsx('container', styles.communityGrid)}>
        <div className={styles.communityCard}>
          <span className={styles.kicker}>Get Involved</span>
          <Heading as="h2">Help Carry RoIS into Practice</Heading>
          <p>
            OpenRoIS is developed in the open under the Apache License 2.0. Components for new robots
            are the natural entry point, and the roadmap lists work that can be picked up in
            parallel.
          </p>
          <div className={styles.standards}>
            {STANDARDS.map((s) => (
              <span key={s} className={styles.chip}>
                {s}
              </span>
            ))}
          </div>
          <div className={styles.heroButtons}>
            <Link className="button button--primary" href={GITHUB_REPO}>
              Contribute on GitHub
            </Link>
            <Link className="button button--secondary" to="/docs/project/contributing">
              Contributing Guide
            </Link>
          </div>
        </div>
        <div className={styles.communityCard}>
          <span className={styles.kicker}>Cite OpenRoIS</span>
          <Heading as="h3">Using OpenRoIS in Your Research?</Heading>
          <p>
            The position paper describing OpenRoIS was submitted to SII 2027 and is under review.{' '}
            {PAPER_URL ? (
              <>
                Read the <Link href={PAPER_URL}>OpenRoIS arXiv preprint</Link>.
              </>
            ) : (
              <>The preprint is on its way to arXiv and will be linked here.</>
            )}{' '}
            Until the paper is published, please cite the software, or the preprint once it
            appears. The repository also provides a CITATION.cff file.
          </p>
          <CodeBlock language="bibtex">{PAPER_BIBTEX}</CodeBlock>
          <CodeBlock language="bibtex">{BIBTEX}</CodeBlock>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Open-source middleware for the OMG RoIS Framework 2.0"
      description="OpenRoIS implements the OMG Robotic Interaction Service (RoIS) Framework 2.0. Control physical robots, virtual avatars, and AI services through standard interfaces. Apache-2.0.">
      <Hero />
      <main>
        <Architecture />
        <Why />
        <Features />
        <Interfaces />
        <Code />
        <Status />
        <Community />
      </main>
    </Layout>
  );
}
