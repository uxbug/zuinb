import "@testing-library/jest-dom"
import "../../system/real-paths"
import BrimApi from "src/js/api"
import {BrimMain} from "src/js/electron/brim"
import {main} from "src/js/electron/main"
import initialize from "src/js/initializers/initialize"
import PluginManager from "src/js/initializers/pluginManager"
import Current from "src/js/state/Current"
import Lakes from "src/js/state/Lakes"
import {Lake} from "src/js/state/Lakes/types"
import {Pool} from "src/js/state/Pools/types"
import {Store} from "src/js/state/types"
import {onPage} from "./utils"

class BrimTestContext {
  store: Store
  plugins: PluginManager
  main: BrimMain
  api: BrimApi

  assign(args: {
    store: Store
    plugins: PluginManager
    main: BrimMain
    api: BrimApi
  }) {
    this.store = args.store
    this.plugins = args.plugins
    this.main = args.main
    this.api = args.api
  }

  select = (fn) => fn(this.store.getState())
  dispatch = (action) => this.store.dispatch(action)
  navTo = (path: string) => this.select(Current.getHistory).push(path)
  cleanup = () => this.plugins.deactivate()
}

type Args = {
  page?: string
  lake?: Lake
  pool?: Pool
}
const defaults = () => ({
  page: "search",
  lake: null,
  pool: null,
})

async function bootBrim({page}: Args = defaults()) {
  const brimMain = await main({lake: false})
  onPage(page)
  const {store, pluginManager} = await initialize()
  const api = new BrimApi()
  api.init(store.dispatch, store.getState)
  return {store, main: brimMain, plugins: pluginManager, api}
}

export function setupBrim(opts: Args = defaults()) {
  const context = new BrimTestContext()

  beforeEach(async () => {
    const props = await bootBrim(opts)
    context.assign(props)
    if (opts.lake) {
      context.dispatch(Lakes.add(opts.lake))
    }
  })

  afterEach(() => context.cleanup())

  return context
}
