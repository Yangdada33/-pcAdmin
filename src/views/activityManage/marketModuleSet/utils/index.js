import router, { navigatePath } from '@/router/index'
import store from '@/store/index'

/*
* stepType: prev-上一步 next-下一步
* */
export function stepAction(stepType) {
  const pthList = router.currentRoute.path.split('/')
  const pathChildren = store.state.activity.moduleList[1].children
  const pathIndex = pathChildren.findIndex(item => item === pthList[pthList.length - 1])
  switch (stepType) {
    case 'prev':
      if (pathIndex === 0) {
        navigatePath('/activityManage/baseSet/marketModuleSelect')
      } else {
        navigatePath('/activityManage/marketModuleSet/' + pathChildren[pathIndex - 1])
      }
      break
    case 'next':
      if (pathIndex === pathChildren.length - 1) {
        const { path } = store.state.activity.moduleList[2]
        if (path === 'liveSet') {
          navigatePath('/activityManage/liveSet/anchorSet')
        } else if (path === 'employeeManage') {
          navigatePath('/activityManage/employeeManage/stepSet')
        }
      } else {
        navigatePath('/activityManage/marketModuleSet/' + pathChildren[pathIndex + 1])
      }
      break
    default:
      break
  }
}
