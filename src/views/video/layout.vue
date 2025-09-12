<template>
	<div class="layout">
		<Background />
		<el-container>
			<el-header height="100px">
				<div class="header">
					<div class="left-section">
					</div>
					<div class="center-section">
						<div class="search">
							<el-input placeholder="搜索" :prefix-icon="Search" v-model="searchText" />
						</div>
					</div>
					<div class="right-section">
						<div class="actions">
							<div class="icon-group">
								<el-button class="btn-icon" :icon="Message" circle></el-button>
								<el-button class="btn-icon" :icon="Setting" circle></el-button>
							</div>
						</div>
					</div>
				</div>
			</el-header>

			<el-container class="main-container">
				<el-aside width="0px">
					<div class="side-menu-container">
						<el-menu class="side-menu" default-active="1">
							<el-menu-item index="1">
								<el-icon>
									<Promotion />
								</el-icon>
								<span>推荐</span>
							</el-menu-item>
							<el-menu-item index="2">
								<el-icon>
									<Star />
								</el-icon>
								<span>关注</span>
							</el-menu-item>
							<el-menu-item index="3">
								<el-icon>
									<Location />
								</el-icon>
								<span>同城</span>
							</el-menu-item>
							<el-menu-item index="4">
								<el-icon>
									<Histogram />
								</el-icon>
								<span>热门</span>
							</el-menu-item>
							<el-menu-item index="5">
								<el-icon>
									<Timer />
								</el-icon>
								<span>最新</span>
							</el-menu-item>
						</el-menu>

					</div>
				</el-aside>

				<el-main>

					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Background from '../../components/Background.vue'
import {
	Search,
	Message,
	Setting,
	Promotion,
	Star,
	Location,
	Histogram,
	Timer,
} from '@element-plus/icons-vue'

const searchText = ref('')



</script>

<style scoped lang="scss">
@use '../../styles/variables' as *;

.layout {
	min-height: 100vh;
	display: flex;
	flex-direction: column;

	.header {
		display: flex;
		align-items: center;
		height: 100%;
		backdrop-filter: blur(10px);
		background: rgba(255, 255, 255, 0.8);
		width: 100%;

		.left-section {
			width: 300px;
			padding-left: 40px;

			.logo {
				font-size: 36px;
				font-weight: bold;
				color: $primary-color;
				cursor: pointer;
				font-family: 'Comic Sans MS', cursive;
				text-shadow: 2px 2px 4px rgba($text-color, 0.1);
				height: 100px;
				line-height: 100px;
			}
		}

		.center-section {
			flex: 1;
			display: flex;
			justify-content: center;
			padding: 0 40px;

			.search {
				width: 600px;
				height: 60px;
				display: flex;
				align-items: center;

				:deep(.el-input__wrapper) {
					background: rgba(255, 255, 255, 0.9);
					border: 1px solid rgba($border-color, 0.5);
					backdrop-filter: blur(4px);
					box-shadow: 0 4px 12px rgba($text-color, 0.05);
					height: 60px;
					border-radius: 30px;
					padding: 0 30px;

					.el-input__inner {
						font-size: 18px;
					}

					.el-input__prefix {
						font-size: 20px;
					}
				}
			}
		}

		.right-section {
			width: 300px;
			padding-right: 40px;

			.actions {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				gap: 8px;
				height: 60px;

				.icon-group {
					display: flex;
					gap: 8px;

					.btn-icon {
						width: 50px;
						height: 50px;
						padding: 0;
						background: rgba(255, 255, 255, 0.9);
						border: 1px solid rgba($border-color, 0.5);
						color: $text-color;
						font-size: 20px;

						&:hover {
							background: rgba(255, 255, 255, 1);
							border-color: $tertiary-color;
							color: $tertiary-color;
							transform: translateY(-2px);
							box-shadow: 0 4px 12px rgba($text-color, 0.1);
						}
					}
				}
			}
		}
	}

	.main-container {
		flex: 1;
		position: relative;
		margin-left: 300px;
	}

	.side-menu-container {
		position: fixed;
		top: 100px;
		left: 0;
		bottom: 0;
		width: 300px;
		padding: 20px 0px;
		z-index: 2;
		display: flex;
		flex-direction: column;
	}

	.menu-divider {
		flex: 1;
		min-height: 20px;
	}

	.side-menu {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border-right: none;
		margin: 0 40px;
		width: 260px !important;
		border-radius: 16px;
		padding: 15px 0;

		:deep(.el-menu-item) {
			height: 60px;
			line-height: 60px;
			margin: 5px 15px;
			border-radius: 12px;
			font-size: 16px;

			&:hover,
			&.is-active {
				background: linear-gradient(to right,
						rgba($primary-color, 0.1),
						transparent);
				color: $primary-color;
			}

			.el-icon {
				font-size: 20px;
			}
		}
	}


}
</style>