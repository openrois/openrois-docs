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
    title: 'Recursive Engine',
    description:
      'One Engine class used by both the gateway and adapters. The gateway has child engines, the adapter has local components. Python (openrois_core, planned). TypeScript POC exists today.',
  },
  {
    title: 'Component Contract',
    description:
      'A five-method contract (discover, invoke, query, subscribe, unsubscribe) that decouples the engine from any specific middleware. SubEngine proxy implements it remotely, ComponentRegistry locally.',
  },
  {
    title: 'RoIS Components',
    description:
      'The 17 basic HRI components with per-paradigm backends (YOLO, MediaPipe, Whisper, Nav2, Piper). Plus user-defined non-canonical components per spec section 12.',
  },
  {
    title: 'RoIS Client SDKs',
    description:
      'TypeScript for web (primary), C# for Unity (primary), Python for scripting (secondary). Identical behavior regardless of host paradigm.',
  },
];

const phases = [
  {id: '0', theme: 'Paradigm-Neutral Interfaces', status: 'done'},
  {id: '1', theme: 'Engine and Sub-engine (TypeScript POC)', status: 'done'},
  {id: '2', theme: 'Adapter Framework and Components', status: 'done'},
  {id: '3', theme: 'Client SDKs and MVP (v0.1.0)', status: 'done'},
  {id: '4', theme: 'Recursive Core Refactor (Python openrois_core)', status: 'todo'},
  {id: '5', theme: 'Solidify the Core', status: 'todo'},
  {id: '6', theme: 'Gateway Process', status: 'todo'},
  {id: '7', theme: 'Adapter Process', status: 'todo'},
  {id: '8', theme: 'Real Component and Mixed Paradigm', status: 'todo'},
  {id: '9', theme: 'Auth, Security, Media', status: 'todo'},
  {id: '10', theme: 'Full Component Library (v1.0)', status: 'todo'},
  {id: '11', theme: 'Hub and Component Marketplace', status: 'parked'},
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
            OpenRoIS lets service applications control robots, avatars, and digital
            agents over the internet through a single SDK. The host paradigm is hidden
            behind a gateway. A scenario written once can drive a ROS 2 robot, a Unity
            avatar, or a distributed AI service without code changes.
          </p>
          <p>
            The primary demonstrated path is a web service application controlling a
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
            <strong>Alpha, pre-1.0, unstable API.</strong> Phases 0 to 3 are
            complete: the type pipeline, engine (TypeScript POC), adapter framework,
            reference components, and all three client SDKs are built and working
            against a real robot. The recursive core refactor (migration to Python
            <code>openrois_core</code>) is the next phase.
          </p>
          <div className="row">
            <div className="col col--6 col--offset-3">
              <table>
                <thead>
                  <tr>
                    <th>Phase</th>
                    <th>Theme</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {phases.map((m) => (
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
