import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/White%20Paper/introduction">
            Read the White Paper
          </Link>
        </div>
      </div>
    </header>
  );
}

const artifacts = [
  {
    title: 'RoIS Interfaces',
    description:
      'Transport-independent types derived from the OMG IDL. Authored as Python (Pydantic), exported to JSON Schema, generated into C# and TypeScript.',
  },
  {
    title: 'RoIS Engine + Gateway',
    description:
      'Bus-independent runtime (Python) that manages components and exposes them remotely over WebSocket.',
  },
  {
    title: 'RoIS BusAdapters',
    description:
      'Pluggable bindings: ROS 2 (robot), InProcess (avatar), gRPC (services). All implement one four-method contract.',
  },
  {
    title: 'RoIS Components',
    description:
      'The 17 basic HRI components with per-paradigm backends (YOLO, MediaPipe, Whisper, Nav2, Piper).',
  },
  {
    title: 'RoIS Client SDKs',
    description:
      'C# for Unity (primary), TypeScript for web, Python for scripting. Identical behavior regardless of host paradigm.',
  },
];

const milestones = [
  {id: 'M0', theme: 'Paradigm-Neutral Interfaces', status: 'done'},
  {id: 'M1', theme: 'Engine and In-Process Bus', status: 'todo'},
  {id: 'M2', theme: 'Remote Gateway', status: 'todo'},
  {id: 'M3', theme: 'ROS 2 Bus Adapter', status: 'todo'},
  {id: 'M4', theme: 'Mock ROS 2 Robot Components', status: 'todo'},
  {id: 'M5', theme: 'SDK and Robot MVP (v0.1.0)', status: 'todo'},
  {id: 'M8', theme: 'Real Component and Mixed Paradigm', status: 'todo'},
  {id: 'M9', theme: 'Auth and Bus Security', status: 'todo'},
  {id: 'M10', theme: 'WebRTC Media', status: 'todo'},
  {id: 'M11', theme: 'Full Component Library (v1.0)', status: 'todo'},
];

function ArtifactCard({title, description}: {title: string; description: string}) {
  return (
    <div className="card margin--sm padding--md">
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

function StatusBadge({status}: {status: string}) {
  const color = status === 'done' ? 'badge--success' : 'badge--secondary';
  return <span className={`badge ${color}`}>{status}</span>;
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="OpenRoIS"
      description="Open-source middleware for the OMG RoIS Framework 2.0. Control robots, avatars, and digital agents from one paradigm-neutral SDK.">
      <HomepageHeader />
      <main className="container margin-vert--xl">
        <section className="text--center margin-bottom--xl">
          <Heading as="h2">What is OpenRoIS?</Heading>
          <p>
            OpenRoIS lets operator applications control robots, avatars, and digital
            agents over the internet through a single SDK. The host paradigm is hidden
            behind a gateway. A scenario written once can drive a ROS 2 robot, a Unity
            avatar, or a distributed AI service without code changes.
          </p>
          <p>
            The primary demonstrated path is a Unity operator application controlling a
            ROS 2 robot over WebSocket. The same interfaces also drive in-process
            avatars and distributed services.
          </p>
        </section>

        <section className="margin-bottom--xl">
          <Heading as="h2" className="text--center margin-bottom--lg">
            What OpenRoIS provides
          </Heading>
          <div className="row">
            {artifacts.map((a) => (
              <div key={a.title} className="col col--4">
                <ArtifactCard title={a.title} description={a.description} />
              </div>
            ))}
          </div>
        </section>

        <section className="margin-bottom--xl">
          <Heading as="h2" className="text--center margin-bottom--lg">
            Status
          </Heading>
          <p className="text--center">
            <strong>Alpha, pre-1.0, unstable API.</strong> The interface types (M0) are
            complete and stable. The engine, gateway, bus adapters, components, and
            SDKs are under construction.
          </p>
          <div className="row">
            <div className="col col--6 col--offset-3">
              <table>
                <thead>
                  <tr>
                    <th>Milestone</th>
                    <th>Theme</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.map((m) => (
                    <tr key={m.id}>
                      <td><strong>{m.id}</strong></td>
                      <td>{m.theme}</td>
                      <td><StatusBadge status={m.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="text--center margin-bottom--xl">
          <Heading as="h2">License</Heading>
          <p>
            Apache-2.0. The normative files retain their upstream copyright (JARA,
            ETRI, KAR, OMG) and are not modified.
          </p>
        </section>

        <section className="text--center">
          <Link
            className="button button--primary button--lg"
            to="/docs/White%20Paper/introduction">
            Read the White Paper
          </Link>
        </section>
      </main>
    </Layout>
  );
}
