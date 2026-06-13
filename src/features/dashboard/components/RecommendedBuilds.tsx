import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui'
import { recommendedBuilds, resolveSkillNames } from '@/lib/skills'
import type { Goal } from '@/types/domain'

/** Builds méta conseillés pour l'objectif sélectionné, renvoyant vers /builds. */
export function RecommendedBuilds({ goal }: { goal: Goal }) {
  const builds = recommendedBuilds(goal)

  return (
    <div className="space-y-3">
      {builds.map((build) => (
        <article key={build.id} className="rounded-lg border border-slate-800 bg-slate-950/55 p-3">
          <h3 className="font-medium text-slate-100">{build.name}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {resolveSkillNames(build.skills).map((skillName, index) => (
              <Badge key={`${build.id}-${index}`}>{skillName}</Badge>
            ))}
          </div>
        </article>
      ))}
      <Link
        to="/builds"
        className="inline-flex items-center gap-1 text-sm font-medium text-amber-200 transition hover:text-amber-100"
      >
        Voir tous les builds
        <ArrowRight size={15} aria-hidden />
      </Link>
    </div>
  )
}
